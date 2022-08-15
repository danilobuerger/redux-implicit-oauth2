import querystring from "query-string";
import cuid from "cuid";
import openPopup from "./util/popup";
import { generateCodeVerifier, codeChallengeFromVerifier } from "./util/pkce";

const responseToJson = response => {
  const expiresIn = response.expires_in ? parseInt(response.expires_in) : NaN;
  return {
    token: response.access_token,
    expiresAt: !isNaN(expiresIn) ? Date.now() + expiresIn * 1000 : null,
  };
};

const listenForAuthCode = (popup, state, resolve, reject) => {
  let search, response;
  try {
    search = popup.location.search;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      // if auth server is on different domain, will be trapped here until redirected back to main site
      /* eslint-disable no-console */
      console.error(err);
      /* eslint-enable no-console */
    }
  }

  if (search) {
    response = querystring.parse(search);
    if (response.code === undefined && response.error === undefined) {
      // if auth server is on same domain as main site, search will be accessible, but auth wont be 'done' until there is a code or an error returned
      if (process.env.NODE_ENV !== "production") {
        /* eslint-disable no-console */
        console.error("auth endpoint not redirected back yet");
        /* eslint-enable no-console */
      }
      response = null;
    }
  }

  if (response) {
    popup.close();

    if (response.state !== state) {
      reject("Invalid state returned.");
    }

    if (response.code) {
      const result = {
        token: response.code,
      };
      resolve(result);
    } else {
      reject(response.error || "Unknown error.");
    }
  } else if (popup.closed) {
    reject("Authentication was cancelled.");
  } else {
    setTimeout(() => listenForAuthCode(popup, state, resolve, reject), 100);
  }
};

const listenForCredentials = (popup, state, resolve, reject) => {
  let hash;
  try {
    hash = popup.location.hash;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      /* eslint-disable no-console */
      console.error(err);
      /* eslint-enable no-console */
    }
  }

  if (hash) {
    popup.close();

    const response = querystring.parse(hash.substr(1));
    if (response.state !== state) {
      reject("Invalid state returned.");
    }

    if (response.access_token) {
      resolve(responseToJson(response));
    } else {
      reject(response.error || "Unknown error.");
    }
  } else if (popup.closed) {
    reject("Authentication was cancelled.");
  } else {
    setTimeout(() => listenForCredentials(popup, state, resolve, reject), 100);
  }
};

const responseTypeFromConfig = config => {
  if (
    config.tokenUrl === undefined ||
    config.tokenUrl === null ||
    config.tokenUrl.length === 0
  ) {
    // default to implicit grant unless tokenUrl defined
    return "token";
  } else {
    // authcode
    return "code";
  }
};

const tokenFromCode = (config, response, codeVerifier) => {
  var body = new URLSearchParams();
  body.append("grant_type", "authorization_code");
  body.append("code", response.token);
  body.append("redirect_uri", config.redirect);
  body.append("client_id", config.client);
  body.append("code_verifier", codeVerifier);
  if (config.clientSecret !== undefined && config.clientSecret) {
    body.append("client_secret", config.clientSecret);
  }

  return fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: body.toString(),
  })
    .then(response => {
      if (response.ok) return response;
      throw Error(`Error from token endpoint, status: ${response.status}`);
    })
    .then(response => response.json())
    .then(response => {
      if (response.access_token) {
        return responseToJson(response);
      } else {
        throw Error(
          `Unknown error from token endpoint, error ${response.error}`
        );
      }
    })
    .catch(e => {
      /* eslint-disable no-console */
      console.error(e.message);
      /* eslint-enable no-console */
      return Promise.reject(e.message || "Unknown error from token endpoint");
    });
};

const authorizeAuthCode = config => {
  const width = config.width || 400;
  const height = config.height || 400;
  // open up popup ASAP (since delays for generating the code verifier and hashing it can cause the auth popup to be blocked on some browsers)
  // points to nothing at first - it will get redirected later
  const popup = openPopup("", "oauth2", width, height);

  const state = cuid();
  const codeVerifier = generateCodeVerifier();
  const challenge = codeChallengeFromVerifier(codeVerifier);
  const authParams = {
    state,
    response_type: "code",
    client_id: config.client,
    scope: config.scope,
    redirect_uri: config.redirect,
    code_challenge_method: "S256",
    code_challenge: challenge,
    prompt: config.prompt,
  };

  const query = querystring.stringify(authParams);
  const url = config.url + (config.url.indexOf("?") === -1 ? "?" : "&") + query;

  popup.location.href = url;

  return new Promise((resolve, reject) =>
    listenForAuthCode(popup, state, resolve, reject)
  ).then(response => tokenFromCode(config, response, codeVerifier));
};

const authorizeImplicit = config => {
  const state = cuid();
  const query = querystring.stringify({
    state,
    response_type: "token",
    client_id: config.client,
    scope: config.scope,
    redirect_uri: config.redirect,
    prompt: config.prompt,
  });
  const url = config.url + (config.url.indexOf("?") === -1 ? "?" : "&") + query;
  const width = config.width || 400;
  const height = config.height || 400;
  const popup = openPopup(url, "oauth2", width, height);

  return new Promise((resolve, reject) =>
    listenForCredentials(popup, state, resolve, reject)
  );
};

export const authorize = config => {
  return responseTypeFromConfig(config) === "code"
    ? authorizeAuthCode(config)
    : authorizeImplicit(config);
};

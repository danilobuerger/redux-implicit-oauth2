export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";
export const TOKEN_B_REQUEST = "TOKEN_B_REQUEST";
export const TOKEN_B_SUCCESS = "TOKEN_B_SUCCESS";
export const TOKEN_B_FAILURE = "TOKEN_B_FAILURE";
export const EXTENSION_GRANT = "EXTENSION_GRANT";

export const loginSuccess = (token, expiresAt, disableLocalStorage) => ({
  type: LOGIN_SUCCESS,
  token,
  expiresAt,
  disableLocalStorage,
});

export const loginFailure = error => ({
  type: LOGIN_FAILURE,
  error,
});

export const login = config => ({
  type: LOGIN_REQUEST,
  config,
});

export const logout = () => ({
  type: LOGOUT,
});

//secondary auth
export const tokenBRequest = (config, link) => ({
  type: TOKEN_B_REQUEST,
  config,
  link,
});
export const tokenBSuccess = token => ({
  type: TOKEN_B_SUCCESS,
  token,
});
export const tokenBFailure = error => ({
  type: TOKEN_B_FAILURE,
  error,
});
export const extensionGrant = extensionGrant => ({
  type: EXTENSION_GRANT,
  extensionGrant,
});

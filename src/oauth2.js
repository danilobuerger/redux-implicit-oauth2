import querystring from 'query-string'
import cuid from 'cuid'
import openPopup from './util/popup'

const listenForCredentials = (popup, state, resolve, reject) => {
  let hash
  try {
    hash = popup.location.hash
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint-disable no-console */
      console.error(err)
      /* eslint-enable no-console */
    }
  }

  if (hash) {
    popup.close()

    const response = querystring.parse(hash.substr(1))
    if (response.state !== state) {
      reject('Invalid state returned.')
    }

    if (response.access_token) {
      resolve(response.access_token)
    } else {
      reject(response.error || 'Unknown error.')
    }
  } else if (popup.closed) {
    reject('Authentication was cancelled.')
  } else {
    setTimeout(() => listenForCredentials(popup, state, resolve, reject), 100)
  }
}

const authorize = (config) => {
  const state = cuid()
  const query = querystring.stringify({
    state,
    response_type: 'token',
    client_id: config.client,
    scope: config.scope,
    redirect_uri: config.redirect
  })
  const popup = openPopup(config.url + '?' + query, 'oauth2')

  return new Promise((resolve, reject) => listenForCredentials(popup, state, resolve, reject))
}

export default authorize

import querystring from 'query-string'
import cuid from 'cuid'
import openPopup from './util/popup'

const listenForCredentials = (popup, state, resolve, reject, config) => {
  let hash
  let credentialsFound = true
  try {
    hash = popup.location.hash
    if (config.parseQuery) {
      credentialsFound = false
      const parsedQuery = querystring.parse(popup.location.search)
      if (parsedQuery[config.accessTokenKey]) {
        hash = hash ? hash + '&access_token=' + parsedQuery[config.accessTokenKey] : '#access_token=' + parsedQuery[config.accessTokenKey]
      }
      if (parsedQuery.state) {
        hash = hash ? hash + '&state=' + parsedQuery.state : '#state=' + parsedQuery.state 
      }
      if (hash.includes('access_token') && hash.includes('state')) {
        credentialsFound = true
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      /* eslint-disable no-console */
      console.error(err)
      /* eslint-enable no-console */
    }
  }

  if (hash && credentialsFound) {
    popup.close()

    const response = querystring.parse(hash.substr(1))
    if (response.state !== state) {
      reject('Invalid state returned.')
    }

    if (response.access_token) {
      const expiresIn = response.expires_in
        ? parseInt(response.expires_in)
        : NaN
      const result = {
        token: response.access_token,
        expiresAt: !isNaN(expiresIn) ? Date.now() + expiresIn * 1000 : null
      }
      resolve(result)
    } else {
      reject(response.error || 'Unknown error.')
    }
  } else if (popup.closed) {
    reject('Authentication was cancelled.')
  } else {
    setTimeout(() => listenForCredentials(popup, state, resolve, reject, config), 100)
  }
}

const authorize = config => {
  const state = cuid()
  const query = querystring.stringify({
    state,
    response_type: config.responseType,
    client_id: config.client,
    scope: config.scope,
    redirect_uri: config.redirect
  })
  const url = config.url + (config.url.indexOf('?') === -1 ? '?' : '&') + query
  const width = config.width || 400
  const height = config.height || 400
  const popup = openPopup(url, 'oauth2', width, height)

  return new Promise((resolve, reject) =>
    listenForCredentials(popup, state, resolve, reject, config)
  )
}

export default authorize

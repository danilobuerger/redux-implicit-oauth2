export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT = 'LOGOUT'

export const loginSuccess = (token, expiresAt) => ({
  type: LOGIN_SUCCESS,
  token,
  expiresAt
})

export const loginFailure = error => ({
  type: LOGIN_FAILURE,
  error
})

export const login = (
  { 
    url,
    client,
    redirect,
    scope,
    responseType = 'token',
    accessTokenKey = 'access_token',
    parseQuery = false,
    width = 400,
    height = 400
  }
) => ({
  type: LOGIN_REQUEST,
  config: {
    url,
    client,
    redirect,
    scope,
    responseType,
    accessTokenKey,
    parseQuery,
    width,
    height
  }
})

export const logout = () => ({
  type: LOGOUT
})

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

export const login = config => ({
  type: LOGIN_REQUEST,
  config
})

export const logout = () => ({
  type: LOGOUT
})

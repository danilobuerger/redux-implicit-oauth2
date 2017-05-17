import authorize from './oauth2'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT = 'LOGOUT'

const loginRequest = () => ({
  type: LOGIN_REQUEST
})

const loginSuccess = (token, expires_at) => ({
  type: LOGIN_SUCCESS,
  token,
  expires_at
})

const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  error
})

export const login = (config) => (dispatch) => {
  dispatch(loginRequest())
  return authorize(config).then(
    ({token, expires_at}) => dispatch(loginSuccess(token, expires_at)),
    (error) => dispatch(loginFailure(error))
  )
}

export const logout = () => ({
  type: LOGOUT
})

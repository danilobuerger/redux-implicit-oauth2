import { setToken, removeToken } from './util/token'
import authorize from './oauth2'
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  loginSuccess,
  loginFailure
} from './actions'

const authMiddleware = store => next => action => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return authorize(action.config).then(
        ({ token, expiresAt }) =>
          store.dispatch(loginSuccess(token, expiresAt)),
        error => store.dispatch(loginFailure(error))
      )
    case LOGIN_SUCCESS:
      setToken(action.token, action.expiresAt)
      break
    case LOGIN_FAILURE:
    case LOGOUT:
      removeToken()
      break
  }

  return next(action)
}

export default authMiddleware

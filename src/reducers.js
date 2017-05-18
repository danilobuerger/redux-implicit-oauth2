import { hasToken, getToken, getExpiresAt } from './util/token'
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './actions'

const initialState = {
  isLoggedIn: hasToken(),
  token: getToken(),
  expiresAt: getExpiresAt(),
  error: null
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoggedIn: true,
        token: action.token,
        expiresAt: action.expiresAt,
        error: null
      })
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isLoggedIn: false,
        token: null,
        expiresAt: null,
        error: action.error
      })
    case LOGOUT:
      return Object.assign({}, state, {
        isLoggedIn: false,
        token: null,
        expiresAt: null,
        error: null
      })
    default:
      return state
  }
}

export default auth

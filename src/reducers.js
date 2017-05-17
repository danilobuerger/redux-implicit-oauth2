import { hasToken, getToken, getExpiresAt } from './util/token'
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './actions'

const initialState = {
  isLoggedIn: hasToken(),
  token: getToken(),
  expires_at: getExpiresAt(),
  error: null
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoggedIn: true,
        token: action.token,
        expires_at: action.expires_at,
        error: null
      })
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isLoggedIn: false,
        token: null,
        expires_at: null,
        error: action.error
      })
    case LOGOUT:
      return Object.assign({}, state, {
        isLoggedIn: false,
        token: null,
        expires_at: null,
        error: null
      })
    default:
      return state
  }
}

export default auth

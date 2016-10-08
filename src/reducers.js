import { hasToken, getToken } from './util/token'
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './actions'

const initialState = {
  isLoggedIn: hasToken(),
  token: getToken(),
  error: null
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoggedIn: true,
        token: action.token,
        error: null
      })
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isLoggedIn: false,
        token: null,
        error: action.error
      })
    case LOGOUT:
      return Object.assign({}, state, {
        isLoggedIn: false,
        token: null,
        error: null
      })
    default:
      return state
  }
}

export default auth

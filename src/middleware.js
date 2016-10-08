import { setToken, removeToken } from './util/token'
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, logout } from './actions'

const authMiddleware = (config) => {
  config = config || {}

  if (!config.hasOwnProperty('logoutOn') || config.logoutOn.constructor !== Array) {
    config.logoutOn = []
  }

  return ({ dispatch }) => (next) => (action) => {
    switch (action.type) {
      case LOGIN_SUCCESS:
        setToken(action.token)
        break
      case LOGIN_FAILURE:
      case LOGOUT:
        removeToken()
        break
    }

    const retVal = next(action)

    if (action.type && config.logoutOn.indexOf(action.type) >= 0) {
      dispatch(logout())
    }

    return retVal
  }
}

export default authMiddleware

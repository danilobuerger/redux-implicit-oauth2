import { hasToken, getToken, getExpiresAt, getGrant } from "./util/token";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  TOKEN_B_REQUEST,
  TOKEN_B_FAILURE,
  TOKEN_B_SUCCESS,
  EXTENSION_GRANT,
} from "./actions";

const initialStateAuth = {
  isLoggedIn: hasToken(),
  token: getToken(),
  expiresAt: getExpiresAt(),
  isLoggingIn: false,
  error: null,
};

export const auth = (state = initialStateAuth, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isLoggingIn: true,
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoggedIn: true,
        token: action.token,
        expiresAt: action.expiresAt,
        error: null,
        isLoggingIn: false,
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isLoggedIn: false,
        token: null,
        expiresAt: null,
        error: action.error,
        isLoggingIn: false,
      });
    case LOGOUT:
      return Object.assign({}, state, {
        isLoggedIn: false,
        token: null,
        expiresAt: null,
        error: null,
        isLoggingIn: false,
      });
    default:
      return state;
  }
};

const initialStateSecondaryAuth = {
  token: getToken(),
  isLoggingIn: false,
  error: null,
  extensionGrant: getGrant(),
  link: null,
};

export const secondaryAuth = (state = initialStateSecondaryAuth, action) => {
  switch (action.type) {
    case TOKEN_B_REQUEST:
      return Object.assign({}, state, {
        isLoggingIn: true,
        link: action.link,
      });
    case TOKEN_B_SUCCESS:
      return Object.assign({}, state, {
        token: action.token,
        error: null,
      });
    case TOKEN_B_FAILURE:
      return Object.assign({}, state, {
        token: null,
        error: action.error,
        isLoggingIn: false,
      });
    case EXTENSION_GRANT:
      return Object.assign({}, state, {
        token: null,
        extensionGrant: action.extensionGrant,
        isLoggingIn: false,
      });
    default:
      return state;
  }
};

# @intercede/redux-oauth2

OAuth 2.0 [Implicit](https://tools.ietf.org/html/rfc6749#section-4.2) and [Authcode](https://tools.ietf.org/html/rfc6749#section-4.1) with [PKCE](https://tools.ietf.org/html/rfc7636) Grant Flow with [Redux](https://github.com/reactjs/redux).

## Example (with React)

The following example displays either a login or logout button depending on the state.
Set the config object according to your OAuth 2.0 server parameters.
The redirect callback page should be on the same site as the rest of your app.

```jsx
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { login, logout } from '@intercede/redux-oauth2'

const config = {
  url: "https://example.com/authorize",
  client: "some_client_id",
  redirect: "https://example.com/callback.html",
  scope: "some_scope",
  width: 400, // Width (in pixels) of login popup window. Optional, default: 400
  height: 400, // Height (in pixels) of login popup window. Optional, default: 400
  tokenUrl: "https://example.com/token", // if present an authcode grant is used, otherwise an implicit grant is used
  // clientSecret: "secret", // some authcode OAuth2 servers may require a client secret to be passed
  disableLocalStorage: true, // unless disableLocalStorage is specified, the token will be stored in local storage (enabling multiple windows to share the token)
  prompt: "login" // as per OpenIDConnect spec to allow login prompt to always be shown
}

const Login = ({ isLoggedIn, login, logout }) => {
  if (isLoggedIn) {
    return <button type='button' onClick={logout}>Logout</button>
  } else {
    return <button type='button' onClick={login}>Login</button>
  }
}

Login.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
}

const mapStateToProps = ({ auth }) => ({
  isLoggedIn: auth.isLoggedIn
})

const mapDispatchToProps = {
  login: () => login(config),
  logout
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
```

Don't forget to add the reducer and middleware to your Redux store:

```js
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { authMiddleware, authReducer as auth } from '@intercede/redux-oauth2'

const configureStore = (initialState) =>
  createStore(
    combineReducers({
      // other reducers
      auth
    }),
    initialState,
    applyMiddleware(
      // other middleware
      authMiddleware
    )
  )

export default configureStore
```

OAuth 2.0 token injection 

## Example (with React)

The following example displays an automatic login based on passing a token through to a new tab. 


```jsx
import React from 'react'
import { connect } from 'react-redux'
import { loginSuccess } from '@intercede/redux-oauth2'


const Login = ({ isLoggedIn, loginSuccess, logout, validAuthToken, authTokenExpiryDate, disableLocalStorage }) => {
  if (isLoggedIn) {
    return <button type='button' onClick={logout}>Logout</button>
  } else {
    return <button type='button' onClick={() => loginSuccess(validAuthToken, authTokenExpiryDate, disableLocalStorage)}>Login</button>
  }
}

const mapStateToProps = ({ auth, config }) => ({
  isLoggedIn: auth.isLoggedIn, 
  validAuthToken: auth.token, 
  authTokenExpiryDate: auth.expiryDate,
  disableLocalStorage: config.disableLocalStorage
})

const mapDispatchToProps = {
  loginSuccess,
  logout
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
```

OAuth 2.0 Extension Grants

## Example (with React)

The following example displays getting an extension grant following secondary authentication

```jsx
import { useEffect } from "react";

const SecondaryAuthLaunched = ({
  isLoggingIn,
  token,
  link,
  getExtensionGrant,
  extensionGrant,
  setError,
}) => {

  useEffect(() => {
    if (isLoggingIn && token) {
      console.log("secondary authenticated - now get extension");
      getExtensionGrant(link.auth)
        .then(extension => {
          extensionGrant(extension);

          history.replace(link.target);
        })
        .catch(error => {
          if (error.message && error.code) {
            setError({ message: error.message, code: error.code });
          } else {
            console.error(error);
          }
        })
        .finally(() => {
          extensionGrant(null);
        });
    }
  });

  return (
    isLoggingIn
  );
};
```
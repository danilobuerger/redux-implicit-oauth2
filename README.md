[![Build Status](https://travis-ci.org/danilobuerger/redux-implicit-oauth2.svg?branch=master)](https://travis-ci.org/danilobuerger/redux-implicit-oauth2) [![Coverage Status](https://coveralls.io/repos/github/danilobuerger/redux-implicit-oauth2/badge.svg?branch=master)](https://coveralls.io/github/danilobuerger/redux-implicit-oauth2?branch=master)

# redux-implicit-oauth2

[OAuth 2.0 Implicit Grant Flow](https://tools.ietf.org/html/rfc6749#section-4.2) with [Redux](https://github.com/reactjs/redux).

## Example (with React)

The following example displays either a login or logout button depending on the state.
Set the config object according to your OAuth 2.0 server parameters.
The redirect callback page should be on the same site as the rest of your app.

```jsx
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { login, logout } from 'redux-implicit-oauth2'

const config = {
  url: "https://example.com/authorize",
  client: "some_client_id",
  redirect: "https://example.com/callback.html",
  scope: "some_scope",
  width: 400, // Width (in pixels) of login popup window. Optional, default: 400
  height: 400, // Height (in pixels) of login popup window. Optional, default: 400
  disableLocalStorage: true // unless disableLocalStorage is specified, the token will be stored in local storage (enabling multiple windows to share the token)
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
import { authMiddleware, authReducer as auth } from 'redux-implicit-oauth2'

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

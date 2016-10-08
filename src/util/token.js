const TOKEN_KEY = 'token'

export const hasToken = () =>
  getToken() !== null

export const getToken = () =>
  window.localStorage.getItem(TOKEN_KEY) || null

export const setToken = (token) => {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
  window.localStorage.removeItem(TOKEN_KEY)
}

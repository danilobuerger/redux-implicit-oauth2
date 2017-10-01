import { getExpiresAt } from './token'

beforeEach(() => {
  localStorage.clear()
})

test('empty localStorage returns null for expiresAt', () => {
  expect(getExpiresAt()).toBe(null)
})

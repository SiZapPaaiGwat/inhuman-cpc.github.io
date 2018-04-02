import isValidParentheses from './isValidParentheses'

test('it should validate parentheses', () => {
  expect(isValidParentheses('()')).toBe(true)
  expect(isValidParentheses('{}')).toBe(true)
  expect(isValidParentheses('[]')).toBe(true)
  expect(isValidParentheses('({[')).toBe(false)
  expect(isValidParentheses('(){}[')).toBe(false)
  expect(isValidParentheses('(){}]')).toBe(false)
  expect(isValidParentheses('({[]})')).toBe(true)
  expect(isValidParentheses('({[})')).toBe(false)
  expect(isValidParentheses('({]})')).toBe(false)
  expect(isValidParentheses('({[]}){}')).toBe(true)
  expect(isValidParentheses('({[}]){}')).toBe(false)
})

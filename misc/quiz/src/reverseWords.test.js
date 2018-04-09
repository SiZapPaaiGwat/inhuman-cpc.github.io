import reverseWords from './reverseWords'

test('it should reverse words', () => {
  expect(reverseWords('hello')).toBe('olleh')
  expect(reverseWords('hello warren buffett')).toBe('olleh nerraw tteffub')
  expect(reverseWords("Let's take a contest")).toBe("s'teL ekat a tsetnoc")
})

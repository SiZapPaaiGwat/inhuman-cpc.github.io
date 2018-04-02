export default function isValidParentheses (s) {
  let stack = []
  for (let i = 0; i < s.length; i += 1) {
    let w = s[i]
    if (w === '(') {
      stack.push(')')
    } else if (w === '{') {
      stack.push('}')
    } else if (w === '[') {
      stack.push(']')
    } else if (stack.length === 0 || stack.pop() !== w) {
      return false
    }
  }

  return stack.length === 0
}

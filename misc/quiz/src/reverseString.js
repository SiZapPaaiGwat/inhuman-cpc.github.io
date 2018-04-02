export default function reverseString (str) {
  return str.split('').reverse().join('')
}

// export default function reverseString (str) {
//   let r = ''
//   for (let i = str.length - 1; i >= 0; i -= 1) {
//     r += str[i]
//   }
//
//   return r
// }

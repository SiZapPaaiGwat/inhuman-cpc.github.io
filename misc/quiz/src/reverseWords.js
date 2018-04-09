export default function reverseString (str) {
  let word = []
  let finalString = ''
  let append = (str) => {
    finalString = finalString ? finalString + ' ' + str : str
  }

  for (let i = 0; i < str.length; i += 1) {
    if (str[i] === ' ') {
      append(word.reverse().join(''))
      word.length = 0
    } else {
      word.push(str[i])
    }
  }

  if (word.length) {
    append(word.reverse().join(''))
  }

  return finalString
}

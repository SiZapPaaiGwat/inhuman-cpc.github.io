export default function hex2RGB (str) {
  str = str.replace('#', '')
  let rgbList = []
  for (let i = 0; i < str.length; i += 2) {
    let value = parseInt(`0x${str[i]}${str[i + 1]}`, 16)
    rgbList.push(value)
  }

  return `rgb(${rgbList.join(', ')})`
}

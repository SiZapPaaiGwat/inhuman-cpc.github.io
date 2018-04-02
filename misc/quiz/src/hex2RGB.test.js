import hex2RGB from './hex2RGB'

test('it should convert hex colors to rgb colors', () => {
  expect(hex2RGB('#000000')).toBe('rgb(0, 0, 0)')
  expect(hex2RGB('#ffffff')).toBe('rgb(255, 255, 255)')
  expect(hex2RGB('#ff00ff')).toBe('rgb(255, 0, 255)')
})

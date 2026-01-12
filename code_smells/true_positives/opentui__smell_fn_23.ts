// @ts-nocheck
export function getCharacterPositions(text: string, font: keyof typeof fonts = 'tiny'): number[] {
  const fontDef = getParsedFont(font)
  if (!fontDef) {
    return [0]
  }
  const positions: number[] = [0]
  let currentX = 0
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase()
    const charDef = fontDef.chars[char]
    let charWidth = 0
    if (!charDef) {
      const spaceChar = fontDef.chars[' ']
      if (spaceChar && spaceChar[0]) {
        for (const segment of spaceChar[0]) {
          charWidth += segment.text.length
        }
      } else {
        charWidth = 1
      }
    } else if (charDef[0]) {
      for (const segment of charDef[0]) {
        charWidth += segment.text.length
      }
    }
    currentX += charWidth
    if (i < text.length - 1) {
      currentX += fontDef.letterspace_size
    }
    positions.push(currentX)
  }
  return positions
}
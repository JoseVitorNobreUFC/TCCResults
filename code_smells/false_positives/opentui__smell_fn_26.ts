// @ts-nocheck
export function measureText({ text, font = 'tiny' }: { text: string; font?: keyof typeof fonts }): {
  width: number
  height: number
} {
  const fontDef = getParsedFont(font)
  if (!fontDef) {
    console.warn(`Font '${font}' not found`)
    return { width: 0, height: 0 }
  }
  let currentX = 0
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase()
    const charDef = fontDef.chars[char]
    if (!charDef) {
      const spaceChar = fontDef.chars[' ']
      if (spaceChar && spaceChar[0]) {
        let spaceWidth = 0
        for (const segment of spaceChar[0]) {
          spaceWidth += segment.text.length
        }
        currentX += spaceWidth
      } else {
        currentX += 1
      }
      continue
    }
    let charWidth = 0
    if (charDef[0]) {
      for (const segment of charDef[0]) {
        charWidth += segment.text.length
      }
    }
    currentX += charWidth
    if (i < text.length - 1) {
      currentX += fontDef.letterspace_size
    }
  }
  return {
    width: currentX,
    height: fontDef.lines,
  }
}
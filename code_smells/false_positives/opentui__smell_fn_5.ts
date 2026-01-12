// @ts-nocheck
function offsetExcludingNewlines(offset: number): number {
  const text = this.editBuffer.getText()
  let displayWidthSoFar = 0
  let newlineCount = 0
  let i = 0
  while (i < text.length && displayWidthSoFar < offset) {
    if (text[i] === `\n`) {
      displayWidthSoFar++
      newlineCount++
      i++
    } else {
      let j = i
      while (j < text.length && text[j] !== `\n`) {
        j++
      }
      const chunk = text.substring(i, j)
      const chunkWidth = Bun.stringWidth(chunk)
      if (displayWidthSoFar + chunkWidth < offset) {
        displayWidthSoFar += chunkWidth
        i = j
      } else {
        for (let k = i; k < j && displayWidthSoFar < offset; k++) {
          const charWidth = Bun.stringWidth(text[k])
          displayWidthSoFar += charWidth
        }
        break
      }
    }
  }
  return offset - newlineCount
}
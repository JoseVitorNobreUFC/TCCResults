// @ts-nocheck
function onLocalSelectionChanged(localSelection: LocalSelectionBounds | null, width: number, height: number): boolean {
  const previousSelection = this.localSelection
  if (!localSelection?.isActive) {
    this.localSelection = null
    return previousSelection !== null
  }
  const text = this.getText()
  const font = this.getFont()
  const selStart = { x: localSelection.anchorX, y: localSelection.anchorY }
  const selEnd = { x: localSelection.focusX, y: localSelection.focusY }
  if (height - 1 < selStart.y || 0 > selEnd.y) {
    this.localSelection = null
    return previousSelection !== null
  }
  let startCharIndex = 0
  let endCharIndex = text.length
  if (selStart.y > height - 1) {
    this.localSelection = null
    return previousSelection !== null
  } else if (selStart.y >= 0 && selStart.y <= height - 1) {
    if (selStart.x > 0) {
      startCharIndex = coordinateToCharacterIndex(selStart.x, text, font)
    }
  }
  if (selEnd.y < 0) {
    this.localSelection = null
    return previousSelection !== null
  } else if (selEnd.y >= 0 && selEnd.y <= height - 1) {
    if (selEnd.x >= 0) {
      endCharIndex = coordinateToCharacterIndex(selEnd.x, text, font)
    } else {
      endCharIndex = 0
    }
  }
  if (startCharIndex < endCharIndex && startCharIndex >= 0 && endCharIndex <= text.length) {
    this.localSelection = { start: startCharIndex, end: endCharIndex }
  } else {
    this.localSelection = null
  }
  return (
    previousSelection?.start !== this.localSelection?.start || previousSelection?.end !== this.localSelection?.end
  )
}
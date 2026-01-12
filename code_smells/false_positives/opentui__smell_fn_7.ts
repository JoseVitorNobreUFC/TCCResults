// @ts-nocheck
useKeyboard((key) => {
  if (key.shift && key.name === 'w') {
    key.preventDefault()
    if (textareaRef && !textareaRef.isDestroyed) {
      const currentMode = wrapMode()
      const nextMode = currentMode === 'word' ? 'char' : currentMode === 'char' ? 'none' : 'word'
      setWrapMode(nextMode)
      textareaRef.wrapMode = nextMode
    }
  }
  if (key.name === 'tab') {
    key.preventDefault()
    if (textareaRef && !textareaRef.isDestroyed) {
      const currentStyle = cursorStyle()
      const nextStyle: CursorStyleOptions =
        currentStyle.style === 'block' ? { style: 'line', blinking: false } : { style: 'block', blinking: true }
      setCursorStyle(nextStyle)
      textareaRef.cursorStyle = nextStyle
    }
  }
  if (key.ctrl && (key.name === 'pageup' || key.name === 'pagedown')) {
    key.preventDefault()
    if (textareaRef && !textareaRef.isDestroyed) {
      if (key.name === 'pageup') {
        textareaRef.editBuffer.setCursor(0, 0)
      } else {
        textareaRef.gotoBufferEnd()
      }
    }
  }
})
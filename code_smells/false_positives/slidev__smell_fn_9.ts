// @ts-nocheck
window.addEventListener('keydown', (e) => {
  if (!drawingEnabled.value || isInputting.value)
    return
  const noModifier = !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey
  let handled = true
  if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) {
    if (e.shiftKey)
      drauu.redo()
    else
      drauu.undo()
  }
  else if (e.code === 'Escape') {
    drawingEnabled.value = false
  }
  else if (e.code === 'KeyL' && noModifier) {
    drawingMode.value = 'line'
  }
  else if (e.code === 'KeyA' && noModifier) {
    drawingMode.value = 'arrow'
  }
  else if (e.code === 'KeyS' && noModifier) {
    drawingMode.value = 'stylus'
  }
  else if (e.code === 'KeyR' && noModifier) {
    drawingMode.value = 'rectangle'
  }
  else if (e.code === 'KeyE' && noModifier) {
    drawingMode.value = 'ellipse'
  }
  else if (e.code === 'KeyC' && noModifier) {
    clearDrauu()
  }
  else if (e.code.startsWith('Digit') && noModifier && +e.code[5] <= brushColors.length) {
    brush.color = brushColors[+e.code[5] - 1]
  }
  else {
    handled = false
  }
  if (handled) {
    e.preventDefault()
    e.stopPropagation()
  }
}, false)
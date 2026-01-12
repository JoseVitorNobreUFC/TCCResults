// @ts-nocheck
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    setSelectedIndex(prev => (prev - 1 + results.length) % results.length || 0)
    return true
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    setSelectedIndex(prev => (prev + 1) % results.length)
    return true
  }
  if (event.key === 'Tab' && !event.shiftKey) {
    event.preventDefault()
    setSelectedIndex(prev => (prev + 1) % results.length)
    return true
  }
  if (event.key === 'Tab' && event.shiftKey) {
    event.preventDefault()
    setSelectedIndex(prev => (prev - 1 + results.length) % results.length || 0)
    return true
  }
  if (event.key === 'Enter') {
    event.preventDefault()
    const selected = results[selectedIndex]
    if (selected) {
      handleItemSelection(selected)
    }
    return true
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    return false
  }
  if (event.key === 'Backspace' && query.endsWith('/') && query.length > 0) {
    event.preventDefault()
    const withoutTrailingSlash = query.slice(0, -1)
    const lastSlashIndex = withoutTrailingSlash.lastIndexOf('/')
    const newPath = lastSlashIndex >= 0 ? withoutTrailingSlash.substring(0, lastSlashIndex + 1) : ''
    if (editor) {
      const { state, dispatch } = editor.view
      const { $from } = state.selection
      const mentionStart = $from.pos - query.length - 1
      const mentionEnd = $from.pos
      const tr = state.tr.replaceRangeWith(
        mentionStart,
        mentionEnd,
        state.schema.text(`@${newPath}`),
      )
      dispatch(tr)
    }
    return true
  }
  return false
}
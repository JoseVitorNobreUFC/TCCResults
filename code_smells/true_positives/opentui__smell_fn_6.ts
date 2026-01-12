// @ts-nocheck
function ensureVisibleTextBeforeHighlight(): void {
  const content = this._content
  if (!this._filetype) {
    if (this.isDestroyed) return
    this.textBuffer.setText(content)
    this._shouldRenderTextBuffer = true
    this.updateTextInfo()
    return
  }
  const isInitialContent = this._streaming && !this._hadInitialContent
  const shouldDrawUnstyledNow = this._streaming ? isInitialContent && this._drawUnstyledText : this._drawUnstyledText
  if (this._streaming && !isInitialContent) {
    if (this._lastHighlights.length > 0) {
      const chunks = treeSitterToTextChunks(content, this._lastHighlights, this._syntaxStyle, {
        enabled: this._conceal,
      })
      const partialStyledText = new StyledText(chunks)
      if (this.isDestroyed) return
      this.textBuffer.setStyledText(partialStyledText)
      this._shouldRenderTextBuffer = true
      this.updateTextInfo()
    } else {
      if (this.isDestroyed) return
      this.textBuffer.setText(content)
      this._shouldRenderTextBuffer = true
      this.updateTextInfo()
    }
  } else if (shouldDrawUnstyledNow) {
    if (this.isDestroyed) return
    this.textBuffer.setText(content)
    this._shouldRenderTextBuffer = true
    this.updateTextInfo()
  } else {
    if (this.isDestroyed) return
    this._shouldRenderTextBuffer = false
    this.updateTextInfo()
  }
}
// @ts-nocheck
function createOrUpdateCodeRenderable(
  side: 'left' | 'right',
  content: string,
  wrapMode: 'word' | 'char' | 'none' | undefined,
  drawUnstyledText?: boolean,
): CodeRenderable {
  const existingRenderable = side === 'left' ? this.leftCodeRenderable : this.rightCodeRenderable
  if (!existingRenderable) {
    const codeOptions: CodeOptions = {
      id: this.id ? `${this.id}-${side}-code` : undefined,
      content,
      filetype: this._filetype,
      wrapMode,
      conceal: this._conceal,
      syntaxStyle: this._syntaxStyle ?? SyntaxStyle.create(),
      width: '100%',
      height: '100%',
      ...(drawUnstyledText !== undefined && { drawUnstyledText }),
      ...(this._selectionBg !== undefined && { selectionBg: this._selectionBg }),
      ...(this._selectionFg !== undefined && { selectionFg: this._selectionFg }),
      ...(this._treeSitterClient !== undefined && { treeSitterClient: this._treeSitterClient }),
    }
    const newRenderable = new CodeRenderable(this.ctx, codeOptions)
    if (side === 'left') {
      this.leftCodeRenderable = newRenderable
    } else {
      this.rightCodeRenderable = newRenderable
    }
    return newRenderable
  } else {
    existingRenderable.content = content
    existingRenderable.wrapMode = wrapMode ?? 'none'
    existingRenderable.conceal = this._conceal
    if (drawUnstyledText !== undefined) {
      existingRenderable.drawUnstyledText = drawUnstyledText
    }
    if (this._filetype !== undefined) {
      existingRenderable.filetype = this._filetype
    }
    if (this._syntaxStyle !== undefined) {
      existingRenderable.syntaxStyle = this._syntaxStyle
    }
    if (this._selectionBg !== undefined) {
      existingRenderable.selectionBg = this._selectionBg
    }
    if (this._selectionFg !== undefined) {
      existingRenderable.selectionFg = this._selectionFg
    }
    return existingRenderable
  }
}
// @ts-nocheck
function updateSelectionForMovement(shiftPressed: boolean, isBeforeMovement: boolean): void {
  if (!this.selectable) return
  if (!shiftPressed) {
    this._ctx.clearSelection()
    this._selectionAnchorState = null
    return
  }
  const visualCursor = this.editorView.getVisualCursor()
  const viewport = this.editorView.getViewport()
  const cursorX = this.x + visualCursor.visualCol
  const cursorY = this.y + visualCursor.visualRow
  if (isBeforeMovement) {
    if (!this._ctx.hasSelection) {
      this._ctx.startSelection(this, cursorX, cursorY)
      this._selectionAnchorState = {
        screenX: cursorX,
        screenY: cursorY,
        viewportX: viewport.offsetX,
        viewportY: viewport.offsetY,
      }
    } else if (!this._selectionAnchorState) {
      const selection = this._ctx.getSelection()
      if (selection && selection.isActive) {
        this._selectionAnchorState = {
          screenX: selection.anchor.x,
          screenY: selection.anchor.y,
          viewportX: viewport.offsetX,
          viewportY: viewport.offsetY,
        }
      }
    }
  } else {
    if (this._selectionAnchorState) {
      const deltaY = viewport.offsetY - this._selectionAnchorState.viewportY
      const deltaX = viewport.offsetX - this._selectionAnchorState.viewportX
      if (deltaY !== 0 || deltaX !== 0) {
        const newAnchorX = this._selectionAnchorState.screenX - deltaX
        const newAnchorY = this._selectionAnchorState.screenY - deltaY
        this._ctx.startSelection(this, newAnchorX, newAnchorY)
        this._ctx.updateSelection(this, cursorX, cursorY)
      } else {
        this._ctx.updateSelection(this, cursorX, cursorY)
      }
    } else {
      this._ctx.updateSelection(this, cursorX, cursorY)
    }
  }
}
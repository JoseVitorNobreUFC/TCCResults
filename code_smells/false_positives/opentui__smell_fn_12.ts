// @ts-nocheck
function updateSelection(currentRenderable: Renderable | undefined, x: number, y: number): void {
  if (this.currentSelection) {
    this.currentSelection.focus = { x, y }
    if (this.selectionContainers.length > 0) {
      const currentContainer = this.selectionContainers[this.selectionContainers.length - 1]
      if (!currentRenderable || !this.isWithinContainer(currentRenderable, currentContainer)) {
        const parentContainer = currentContainer.parent || this.root
        this.selectionContainers.push(parentContainer)
      } else if (currentRenderable && this.selectionContainers.length > 1) {
        let containerIndex = this.selectionContainers.indexOf(currentRenderable)
        if (containerIndex === -1) {
          const immediateParent = currentRenderable.parent || this.root
          containerIndex = this.selectionContainers.indexOf(immediateParent)
        }
        if (containerIndex !== -1 && containerIndex < this.selectionContainers.length - 1) {
          this.selectionContainers = this.selectionContainers.slice(0, containerIndex + 1)
        }
      }
    }
    this.notifySelectablesOfSelectionChange()
  }
}
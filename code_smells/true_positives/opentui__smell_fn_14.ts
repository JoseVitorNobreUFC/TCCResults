// @ts-nocheck
function insertBefore(obj: Renderable | VNode<any, any[]> | unknown, anchor?: Renderable | unknown): number {
  if (!anchor) {
    return this.add(obj)
  }
  if (!obj) {
    return -1
  }
  const renderable = maybeMakeRenderable(this._ctx, obj)
  if (!renderable) {
    return -1
  }
  if (renderable.isDestroyed) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Renderable with id ${renderable.id} was already destroyed, skipping insertBefore`)
    }
    return -1
  }
  if (!isRenderable(anchor)) {
    throw new Error('Anchor must be a Renderable')
  }
  if (anchor.isDestroyed) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Anchor with id ${anchor.id} was already destroyed, skipping insertBefore`)
    }
    return -1
  }
  if (!this.renderableMapById.has(anchor.id)) {
    throw new Error('Anchor does not exist')
  }
  if (renderable.parent === this) {
    this.yogaNode.removeChild(renderable.getLayoutNode())
    this._childrenInLayoutOrder.splice(this._childrenInLayoutOrder.indexOf(renderable), 1)
  } else {
    this.replaceParent(renderable)
    this.needsZIndexSort = true
    this.renderableMapById.set(renderable.id, renderable)
    this._childrenInZIndexOrder.push(renderable)
    if (typeof renderable.onLifecyclePass === 'function') {
      this._ctx.registerLifecyclePass(renderable)
    }
    if (renderable._liveCount > 0) {
      this.propagateLiveCount(renderable._liveCount)
    }
  }
  this.childrenPrimarySortDirty = true
  const anchorIndex = this._childrenInLayoutOrder.indexOf(anchor)
  const insertedIndex = Math.max(0, Math.min(anchorIndex, this._childrenInLayoutOrder.length))
  this._childrenInLayoutOrder.splice(insertedIndex, 0, renderable)
  this.yogaNode.insertChild(renderable.getLayoutNode(), insertedIndex)
  this._shouldUpdateBefore.add(renderable)
  this.requestRender()
  return insertedIndex
}
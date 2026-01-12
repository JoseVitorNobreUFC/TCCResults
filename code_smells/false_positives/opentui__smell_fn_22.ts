// @ts-nocheck
function updateYogaPosition(position: Position): void {
  const node = this.yogaNode
  const { top, right, bottom, left } = position
  if (isPositionType(top)) {
    if (top === 'auto') {
      node.setPositionAuto(Edge.Top)
    } else {
      node.setPosition(Edge.Top, top)
    }
  }
  if (isPositionType(right)) {
    if (right === 'auto') {
      node.setPositionAuto(Edge.Right)
    } else {
      node.setPosition(Edge.Right, right)
    }
  }
  if (isPositionType(bottom)) {
    if (bottom === 'auto') {
      node.setPositionAuto(Edge.Bottom)
    } else {
      node.setPosition(Edge.Bottom, bottom)
    }
  }
  if (isPositionType(left)) {
    if (left === 'auto') {
      node.setPositionAuto(Edge.Left)
    } else {
      node.setPosition(Edge.Left, left)
    }
  }
  this.requestRender()
}
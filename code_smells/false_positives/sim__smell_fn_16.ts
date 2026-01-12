// @ts-nocheck
function calculateAccessibleBlocksLegacy(currentBlockId: string): Set<string> {
  const accessibleBlocks = new Set<string>()
  for (const connection of this.workflow.connections) {
    if (connection.target === currentBlockId) {
      accessibleBlocks.add(connection.source)
    }
  }
  const starterBlock = this.workflow.blocks.find((block) => block.metadata?.id === 'starter')
  if (starterBlock) {
    accessibleBlocks.add(starterBlock.id)
  }
  const currentBlockLoop = this.loopsByBlockId.get(currentBlockId)
  if (currentBlockLoop) {
    const loop = this.workflow.loops?.[currentBlockLoop]
    if (loop) {
      for (const nodeId of loop.nodes) {
        accessibleBlocks.add(nodeId)
      }
    }
  }
  for (const [parallelId, parallel] of Object.entries(this.workflow.parallels || {})) {
    if (parallel.nodes.includes(currentBlockId)) {
      for (const nodeId of parallel.nodes) {
        accessibleBlocks.add(nodeId)
      }
    }
  }
  return accessibleBlocks
}
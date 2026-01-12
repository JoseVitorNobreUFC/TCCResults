// @ts-nocheck
export function makeGraphLookup<N extends GraphNode, E extends GraphEdge>(
  nodes: N[],
  edges: E[]
): GraphLookup<N, E> {
  const nodeMap = new Map<string, N>();
  nodes.forEach(n => {
    nodeMap.set(n.id, n);
  });
  const outgoingEdges = new Map<string, E[]>();
  const incomingEdges = new Map<string, E[]>();
  edges.forEach(edge => {
    const s = outgoingEdges.get(edge.source) ?? [];
    s.push(edge);
    outgoingEdges.set(edge.source, s);
    const t = incomingEdges.get(edge.target) ?? [];
    t.push(edge);
    incomingEdges.set(edge.target, t);
  });
  return {
    getOutgoingEdges(nodeId) {
      return outgoingEdges.get(nodeId);
    },
    getIncomingEdges(nodeId) {
      return incomingEdges.get(nodeId);
    },
    getNode(nodeId) {
      return nodeMap.get(nodeId);
    },
  };
}
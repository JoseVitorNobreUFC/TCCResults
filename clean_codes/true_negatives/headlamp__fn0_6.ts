// @ts-nocheck
export function filterGraph(nodes: GraphNode[], edges: GraphEdge[], filters: GraphFilter[]) {
  if (filters.length === 0) {
    return { nodes, edges };
  }
  const filteredNodes: GraphNode[] = [];
  const filteredEdges: GraphEdge[] = [];
  const visitedNodes = new Set();
  const visitedEdges = new Set();
  const graphLookup = makeGraphLookup(nodes, edges);
  function pushRelatedNodes(node: GraphNode) {
    if (visitedNodes.has(node.id)) return;
    visitedNodes.add(node.id);
    filteredNodes.push(node);
    graphLookup.getOutgoingEdges(node.id)?.forEach(edge => {
      const targetNode = graphLookup.getNode(edge.target);
      if (targetNode && !visitedNodes.has(targetNode.id)) {
        if (!visitedEdges.has(edge.id)) {
          visitedEdges.add(edge.id);
          filteredEdges.push(edge);
        }
        pushRelatedNodes(targetNode);
      }
    });
    graphLookup.getIncomingEdges(node.id)?.forEach(edge => {
      const sourceNode = graphLookup.getNode(edge.source);
      if (sourceNode && !visitedNodes.has(sourceNode.id)) {
        if (!visitedEdges.has(edge.id)) {
          visitedEdges.add(edge.id);
          filteredEdges.push(edge);
        }
        pushRelatedNodes(sourceNode);
      }
    });
  }
  nodes.forEach(node => {
    let keep = true;
    filters.forEach(filter => {
      if (filter.type === 'hasErrors') {
        keep &&=
          'kubeObject' in node &&
          node.kubeObject !== undefined &&
          getStatus(node.kubeObject) !== 'success';
      }
      if (filter.type === 'namespace' && filter.namespaces.size > 0) {
        keep &&=
          'kubeObject' in node &&
          node.kubeObject !== undefined &&
          !!node.kubeObject.metadata?.namespace &&
          filter.namespaces.has(node.kubeObject?.metadata?.namespace);
      }
    });
    if (keep) {
      pushRelatedNodes(node);
    }
  });
  return {
    edges: filteredEdges,
    nodes: filteredNodes,
  };
}
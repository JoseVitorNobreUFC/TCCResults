// @ts-nocheck
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
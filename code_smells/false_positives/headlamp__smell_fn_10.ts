// @ts-nocheck
function replaceUseId(node: any) {
  const attributesToReplace = ['id', 'for', 'aria-describedby', 'aria-labelledby', 'aria-controls'];
  if (node.nodeType === Node.ELEMENT_NODE) {
    for (const attr of node.attributes) {
      if (attributesToReplace.includes(attr.name)) {
        if (attr.value.includes(':')) {
          node.setAttribute(attr.name, ':mock-test-id:');
        } else if (attr.name === 'id' && attr.value.includes('recharts')) {
          node.setAttribute(attr.name, 'recharts-id');
        }
      }
    }
    if (node.className && typeof node.className === 'string') {
      node.className = node.className.replace(
        /xterm-dom-renderer-owner-\d+/g,
        'xterm-dom-renderer-owner'
      );
    }
  }
  for (const child of node.childNodes) {
    replaceUseId(child);
  }
}
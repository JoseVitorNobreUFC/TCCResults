// @ts-nocheck
function aggregateTypeInfo(value: any, node: TypeInfoNode, parentObjectCount: number): void {
  node.presenceCount++;
  node.parentObjectCount = parentObjectCount;
  const type = typeof value;
  if (value === null) {
    node.primitiveTypes.add('null');
  } else if (type === 'string') {
    node.hasStringType = true;
    node.primitiveTypes.add('string');
    if (node.stringLiterals.size < MAX_STRING_LITERALS) {
      if (value.length < MAX_STRING_LITERAL_LENGTH) {
        node.stringLiterals.add(value);
      }
    } else {
      node.stringLiterals.clear();
    }
  } else if (type === 'number') {
    node.primitiveTypes.add('number');
  } else if (type === 'boolean') {
    node.primitiveTypes.add('boolean');
  } else if (Array.isArray(value)) {
    node.isArray = true;
    if (!node.arrayElementInfo) {
      node.arrayElementInfo = createTypeInfoNode();
    }
    const arrayPresenceCount = node.presenceCount;
    value.forEach(element => {
      aggregateTypeInfo(element, node.arrayElementInfo!, arrayPresenceCount);
    });
    if (node.arrayElementInfo) node.arrayElementInfo.parentObjectCount = arrayPresenceCount;
  } else if (type === 'object') {
    node.isObject = true;
    const numObjectOccurrences = node.presenceCount;
    const currentKeys = new Set<string>();

    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        currentKeys.add(key);
        if (!node.objectProperties.has(key)) {
          node.objectProperties.set(key, createTypeInfoNode());
        }
        const propertyNode = node.objectProperties.get(key)!;
        aggregateTypeInfo(value[key], propertyNode, numObjectOccurrences);
      }
    }
    node.objectProperties.forEach((propNode, key) => {
      if (!currentKeys.has(key)) {
        propNode.parentObjectCount = numObjectOccurrences;
      }
    });
  }
}
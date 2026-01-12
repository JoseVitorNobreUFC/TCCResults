// @ts-nocheck
export function generateGlobalVarDeclarations(
  objects: Record<string, any>[],
  maxKeysPerObject?: number
): string {
  if (!Array.isArray(objects)) {
    throw new TypeError('Input must be an array.');
  }
  if (objects.length === 0) {
    return '';
  }
  const topLevelPropertyNodes = new Map<string, TypeInfoNode>();
  let validObjectCount = 0;
  for (const obj of objects) {
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      validObjectCount++;
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (!topLevelPropertyNodes.has(key)) {
            topLevelPropertyNodes.set(key, createTypeInfoNode());
          }
          const propertyRootNode = topLevelPropertyNodes.get(key)!;
          aggregateTypeInfo(obj[key], propertyRootNode, 1);
        }
      }
    }
  }
  if (validObjectCount === 0) {
    return '';
  }
  const declarations: string[] = [];
  const sortedKeys = Array.from(topLevelPropertyNodes.keys()).sort();
  for (const key of sortedKeys) {
    if (validIdentifierRegex.test(key)) {
      const propertyNode = topLevelPropertyNodes.get(key)!;
      propertyNode.parentObjectCount = propertyNode.presenceCount;

      const typeString = generateTypeString(propertyNode, undefined, maxKeysPerObject);

      if (typeString !== 'any' || propertyNode.presenceCount > 0) {
        declarations.push(`declare var ${key}: ${typeString};`);
      }
    }
  }
  return declarations.join('\n\n');
}
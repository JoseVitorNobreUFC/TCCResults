// @ts-nocheck
export function extractFieldValues(
  parsedContent: any,
  selectedOutputIds: string[],
  blockId: string
): Record<string, any> {
  const extractedValues: Record<string, any> = {}
  for (const outputId of selectedOutputIds) {
    const blockIdForOutput = extractBlockIdFromOutputId(outputId)
    if (blockIdForOutput !== blockId) {
      continue
    }
    const path = extractPathFromOutputId(outputId, blockIdForOutput)
    if (path) {
      const pathParts = path.split('.')
      let current = parsedContent
      for (const part of pathParts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part]
        } else {
          current = undefined
          break
        }
      }
      if (current !== undefined) {
        extractedValues[path] = current
      }
    }
  }
  return extractedValues
}
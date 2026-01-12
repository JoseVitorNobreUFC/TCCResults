// @ts-nocheck
export function fuzzySearch<T>(
  items: T[],
  pattern: string,
  options: FuzzySearchOptions = {},
): FuzzyMatch[] {
  const { keys = [], threshold = 0.1, minMatchCharLength = 1 } = options
  if (!pattern || pattern.length < minMatchCharLength) {
    return items.map(item => ({
      score: 1,
      indices: [],
      item,
      matches: [],
    }))
  }
  const results: FuzzyMatch[] = []
  for (const item of items) {
    let bestScore = 0
    let bestMatches: Array<{ indices: number[]; key?: string }> = []
    if (keys.length === 0) {
      const match = fuzzyMatchString(pattern, String(item))
      if (match.score > threshold) {
        results.push({
          score: match.score,
          indices: match.indices,
          item,
          matches: [{ indices: match.indices }],
        })
      }
    } else {
      for (const key of keys) {
        const value = (item as any)[key]
        if (typeof value === 'string') {
          const match = fuzzyMatchString(pattern, value)
          if (match.score > bestScore) {
            bestScore = match.score
            bestMatches = [{ indices: match.indices, key }]
          } else if (match.score === bestScore && match.score > threshold) {
            bestMatches.push({ indices: match.indices, key })
          }
        }
      }
      if (bestScore > threshold) {
        results.push({
          score: bestScore,
          indices: bestMatches[0]?.indices || [],
          item,
          matches: bestMatches,
        })
      }
    }
  }
  return results.sort((a, b) => b.score - a.score)
}
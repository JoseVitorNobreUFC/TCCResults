// @ts-nocheck
function getSimpleHighlights(
  matches: QueryCapture[],
  injectionRanges: Map<string, Array<{ start: number; end: number }>>,
): SimpleHighlight[] {
  const highlights: SimpleHighlight[] = []
  const flatInjectionRanges: Array<{ start: number; end: number; lang: string }> = []
  for (const [lang, ranges] of injectionRanges.entries()) {
    for (const range of ranges) {
      flatInjectionRanges.push({ ...range, lang })
    }
  }
  for (const match of matches) {
    const node = match.node
    let isInjection = false
    let injectionLang: string | undefined
    let containsInjection = false
    for (const injRange of flatInjectionRanges) {
      if (node.startIndex >= injRange.start && node.endIndex <= injRange.end) {
        isInjection = true
        injectionLang = injRange.lang
        break
      } else if (node.startIndex <= injRange.start && node.endIndex >= injRange.end) {
        containsInjection = true
        break
      }
    }
    const matchQuery = (match as any)._injectedQuery
    const patternProperties = matchQuery?.setProperties?.[match.patternIndex]
    const concealValue = patternProperties?.conceal ?? match.setProperties?.conceal
    const concealLines = patternProperties?.conceal_lines ?? match.setProperties?.conceal_lines
    const meta: any = {}
    if (isInjection && injectionLang) {
      meta.isInjection = true
      meta.injectionLang = injectionLang
    }
    if (containsInjection) {
      meta.containsInjection = true
    }
    if (concealValue !== undefined) {
      meta.conceal = concealValue
    }
    if (concealLines !== undefined) {
      meta.concealLines = concealLines
    }
    if (Object.keys(meta).length > 0) {
      highlights.push([node.startIndex, node.endIndex, match.name, meta])
    } else {
      highlights.push([node.startIndex, node.endIndex, match.name])
    }
  }
  highlights.sort((a, b) => a[0] - b[0])
  return highlights
}
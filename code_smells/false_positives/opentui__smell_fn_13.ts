// @ts-nocheck
function mergeStyles(...styleNames: string[]): MergedStyle {
  this.guard()
  const cacheKey = styleNames.join(`:`)
  const cached = this.mergedCache.get(cacheKey)
  if (cached) return cached
  const styleDefinition: StyleDefinition = {}
  for (const name of styleNames) {
    const style = this.getStyle(name)
    if (!style) continue
    if (style.fg) styleDefinition.fg = style.fg
    if (style.bg) styleDefinition.bg = style.bg
    if (style.bold !== undefined) styleDefinition.bold = style.bold
    if (style.italic !== undefined) styleDefinition.italic = style.italic
    if (style.underline !== undefined) styleDefinition.underline = style.underline
    if (style.dim !== undefined) styleDefinition.dim = style.dim
  }
  const attributes = createTextAttributes({
    bold: styleDefinition.bold,
    italic: styleDefinition.italic,
    underline: styleDefinition.underline,
    dim: styleDefinition.dim,
  })
  const merged: MergedStyle = {
    fg: styleDefinition.fg,
    bg: styleDefinition.bg,
    attributes,
  }
  this.mergedCache.set(cacheKey, merged)
  return merged
}
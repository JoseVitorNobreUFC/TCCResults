// @ts-nocheck
export function parseSync(
  markdown: string,
  filepath: string,
  options: SlidevParserOptions = {},
): SlidevMarkdown {
  const lines = markdown.split(options.preserveCR ? '\n' : /\r?\n/g)
  const slides: SourceSlideInfo[] = []
  let start = 0
  let contentStart = 0
  function slice(end: number) {
    if (start === end)
      return
    const raw = lines.slice(start, end).join('\n')
    const slide: SourceSlideInfo = {
      ...parseSlide(raw, options),
      filepath,
      index: slides.length,
      start,
      contentStart,
      end,
    }
    slides.push(slide)
    start = end + 1
    contentStart = end + 1
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd()
    if (line.startsWith('---')) {
      slice(i)
      const next = lines[i + 1]
      if (line[3] !== '-' && next?.trim()) {
        start = i
        for (i += 1; i < lines.length; i++) {
          if (lines[i].trimEnd() === '---')
            break
        }
        contentStart = i + 1
      }
    }
    else if (line.trimStart().startsWith('```')) {
      const codeBlockLevel = line.match(/^\s*`+/)![0]
      let j = i + 1
      for (; j < lines.length; j++) {
        if (lines[j].startsWith(codeBlockLevel))
          break
      }
      if (j !== lines.length)
        i = j
    }
  }
  if (start <= lines.length - 1)
    slice(lines.length)
  return {
    filepath,
    raw: markdown,
    slides,
  }
}
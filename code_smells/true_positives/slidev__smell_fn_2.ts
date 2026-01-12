// @ts-nocheck
async function slice(end: number) {
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
  if (extensions) {
    for (const e of extensions) {
      if (e.transformSlide) {
        const newContent = await e.transformSlide(slide.content, slide.frontmatter)
        if (newContent !== undefined)
          slide.content = newContent
        if (typeof slide.frontmatter.title === 'string') {
          slide.title = slide.frontmatter.title
        }
        if (typeof slide.frontmatter.level === 'number') {
          slide.level = slide.frontmatter.level
        }
      }

      if (e.transformNote) {
        const newNote = await e.transformNote(slide.note, slide.frontmatter)
        if (newNote !== undefined)
          slide.note = newNote
      }
    }
  }
  slides.push(slide)
  start = end + 1
  contentStart = end + 1
}
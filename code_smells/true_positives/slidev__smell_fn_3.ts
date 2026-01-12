// @ts-nocheck
server.middlewares.use(async (req, res, next) => {
  const match = req.url?.match(regexSlideReqPath)
  if (!match)
    return next()
  const [, no] = match
  const idx = Number.parseInt(no) - 1
  if (req.method === 'GET') {
    res.write(JSON.stringify(withRenderedNote(data.slides[idx])))
    return res.end()
  }
  else if (req.method === 'POST') {
    const body: SlidePatch = await getBodyJson(req)
    const slide = data.slides[idx]
    if (body.content && body.content !== slide.source.content)
      hmrSlidesIndexes.add(idx)
    if (body.content)
      slide.content = slide.source.content = body.content
    if (body.frontmatterRaw != null) {
      if (body.frontmatterRaw.trim() === '') {
        slide.source.frontmatterDoc = slide.source.frontmatterStyle = undefined
      }
      else {
        const parsed = YAML.parseDocument(body.frontmatterRaw)
        if (parsed.errors.length)
          console.error('ERROR when saving frontmatter', parsed.errors)
        else
          slide.source.frontmatterDoc = parsed
      }
    }
    if (body.note)
      slide.note = slide.source.note = body.note
    if (body.frontmatter) {
      updateFrontmatterPatch(slide.source, body.frontmatter)
      Object.assign(slide.frontmatter, body.frontmatter)
    }
    parser.prettifySlide(slide.source)
    const fileContent = await parser.save(data.markdownFiles[slide.source.filepath])
    if (body.skipHmr) {
      skipHmr = {
        filePath: slide.source.filepath,
        fileContent,
      }
      server?.moduleGraph.invalidateModule(
        server.moduleGraph.getModuleById(sourceIds.md[idx])!,
      )
      if (body.frontmatter) {
        server?.moduleGraph.invalidateModule(
          server.moduleGraph.getModuleById(sourceIds.frontmatter[idx])!,
        )
      }
    }
    res.statusCode = 200
    res.write(JSON.stringify(withRenderedNote(slide)))
    return res.end()
  }
  next()
})
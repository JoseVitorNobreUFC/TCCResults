// @ts-nocheck
async function downloadOrLoad(
  source: string,
  cacheDir: string,
  cacheSubdir: string,
  fileExtension: string,
  useHashForCache: boolean = true,
  filetype?: string,
): Promise<DownloadResult> {
  const isUrl = source.startsWith('http://') || source.startsWith('https://')
  if (isUrl) {
    let cacheFileName: string
    if (useHashForCache) {
      const hash = this.hashUrl(source)
      cacheFileName = filetype ? `${filetype}-${hash}${fileExtension}` : `${hash}${fileExtension}`
    } else {
      cacheFileName = path.basename(source)
    }
    const cacheFile = path.join(cacheDir, cacheSubdir, cacheFileName)
    await mkdir(path.dirname(cacheFile), { recursive: true })
    try {
      const cachedContent = await Bun.file(cacheFile).arrayBuffer()
      if (cachedContent.byteLength > 0) {
        console.log(`Loaded from cache: ${cacheFile} (${source})`)
        return { content: cachedContent, filePath: cacheFile }
      }
    } catch (error) {
    }
    try {
      console.log(`Downloading from URL: ${source}`)
      const response = await fetch(source)
      if (!response.ok) {
        return { error: `Failed to fetch from ${source}: ${response.statusText}` }
      }
      const content = await response.arrayBuffer()
      try {
        await writeFile(cacheFile, Buffer.from(content))
        console.log(`Cached: ${source}`)
      } catch (cacheError) {
        console.warn(`Failed to cache: ${cacheError}`)
      }
      return { content, filePath: cacheFile }
    } catch (error) {
      return { error: `Error downloading from ${source}: ${error}` }
    }
  } else {
    try {
      console.log(`Loading from local path: ${source}`)
      const content = await Bun.file(source).arrayBuffer()
      return { content, filePath: source }
    } catch (error) {
      return { error: `Error loading from local path ${source}: ${error}` }
    }
  }
}
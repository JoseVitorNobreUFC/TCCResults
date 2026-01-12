// @ts-nocheck
async function downloadAndCombineQueries(
  filetype: string,
  queryUrls: string[],
  assetsDir: string,
  outputPath: string,
  queryType: 'highlights' | 'injections',
  configPath: string,
): Promise<string> {
  const queriesDir = path.join(assetsDir, filetype)
  const queryPath = path.join(queriesDir, `${queryType}.scm`)
  const queryContents: string[] = []
  for (let i = 0; i < queryUrls.length; i++) {
    const queryUrl = queryUrls[i]
    if (queryUrl.startsWith('./')) {
      console.log(`    Using local query ${i + 1}/${queryUrls.length}: ${queryUrl}`)
      try {
        const localPath = path.resolve(path.dirname(configPath), queryUrl)
        const content = await readFile(localPath, 'utf-8')
        if (content.trim()) {
          queryContents.push(content)
          console.log(`    ✓ Loaded ${content.split('\n').length} lines from local file`)
        }
      } catch (error) {
        console.warn(`Failed to read local query from ${queryUrl}: ${error}`)
        continue
      }
    } else {
      console.log(`    Downloading query ${i + 1}/${queryUrls.length}: ${queryUrl}`)
      try {
        const response = await fetch(queryUrl)
        if (!response.ok) {
          console.warn(`Failed to download query from ${queryUrl}: ${response.statusText}`)
          continue
        }
        const content = await response.text()
        if (content.trim()) {
          queryContents.push(`; Query from: ${queryUrl}\n${content}`)
          console.log(`    ✓ Downloaded ${content.split('\n').length} lines`)
        }
      } catch (error) {
        console.warn(`Failed to download query from ${queryUrl}: ${error}`)
        continue
      }
    }
  }
  const combinedContent = queryContents.join('\n\n')
  await writeFile(queryPath, combinedContent, 'utf-8')
  console.log(`  Combined ${queryContents.length} queries into ${queryPath}`)
  return './' + path.relative(path.dirname(outputPath), queryPath)
}
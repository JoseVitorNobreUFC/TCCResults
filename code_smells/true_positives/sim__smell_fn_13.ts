// @ts-nocheck
function enforceSizeLimit(chunks: string[]): string[] {
  const finalChunks: string[] = []
  for (const chunk of chunks) {
    const tokens = this.estimateTokens(chunk)
    if (tokens <= 300) {
      finalChunks.push(chunk)
    } else {
      const lines = chunk.split('\n')
      let currentChunk = ''
      for (const line of lines) {
        const testChunk = currentChunk ? `${currentChunk}\n${line}` : line
        if (this.estimateTokens(testChunk) <= 300) {
          currentChunk = testChunk
        } else {
          if (currentChunk.trim()) {
            finalChunks.push(currentChunk.trim())
          }
          currentChunk = line
        }
      }
      if (currentChunk.trim()) {
        finalChunks.push(currentChunk.trim())
      }
    }
  }
  return finalChunks.filter((chunk) => chunk.trim().length > 100)
}
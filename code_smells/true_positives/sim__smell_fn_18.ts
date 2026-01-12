// @ts-nocheck
function splitRecursively(text: string, separatorIndex = 0): string[] {
  const tokenCount = this.estimateTokens(text)
  if (tokenCount <= this.chunkSize) {
    return text.length >= this.minChunkSize ? [text] : []
  }
  if (separatorIndex >= this.separators.length) {
    const chunks: string[] = []
    const targetLength = Math.ceil((text.length * this.chunkSize) / tokenCount)
    for (let i = 0; i < text.length; i += targetLength) {
      const chunk = text.slice(i, i + targetLength).trim()
      if (chunk.length >= this.minChunkSize) {
        chunks.push(chunk)
      }
    }
    return chunks
  }
  const separator = this.separators[separatorIndex]
  const parts = text.split(separator).filter((part) => part.trim())

  if (parts.length <= 1) {
    return this.splitRecursively(text, separatorIndex + 1)
  }
  const chunks: string[] = []
  let currentChunk = ''
  for (const part of parts) {
    const testChunk = currentChunk + (currentChunk ? separator : '') + part
    if (this.estimateTokens(testChunk) <= this.chunkSize) {
      currentChunk = testChunk
    } else {
      if (currentChunk.trim() && currentChunk.length >= this.minChunkSize) {
        chunks.push(currentChunk.trim())
      }
      if (this.estimateTokens(part) > this.chunkSize) {
        chunks.push(...this.splitRecursively(part, separatorIndex + 1))
        currentChunk = ''
      } else {
        currentChunk = part
      }
    }
  }
  if (currentChunk.trim() && currentChunk.length >= this.minChunkSize) {
    chunks.push(currentChunk.trim())
  }
  return chunks
}
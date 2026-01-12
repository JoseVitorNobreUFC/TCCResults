// @ts-nocheck
function findCodeBlocks(docText: string): CodeBlockInfo[] {
  const lines = docText.split(/\r?\n/)
  const codeBlocks: CodeBlockInfo[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trimStart()
    if (trimmedLine.startsWith('```')) {
      const indent = line.slice(0, line.length - trimmedLine.length)
      const codeBlockLevel = line.match(/^\s*`+/)![0]
      const backtickCount = codeBlockLevel.trim().length
      const startLine = i
      if (backtickCount !== 3) {
        continue
      }
      let endLine = i
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].startsWith(codeBlockLevel)) {
          endLine = j
          break
        }
      }
      if (endLine > startLine) {
        codeBlocks.push({
          startLine: startLine + 1,
          endLine,
          indent,
        })
      }
      i = endLine
    }
  }
  return codeBlocks
}
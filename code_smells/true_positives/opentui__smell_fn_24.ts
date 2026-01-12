// @ts-nocheck
function _processLogEntry(logEntry: [Date, LogLevel, any[], CallerInfo | null]): DisplayLine[] {
  const [date, level, args, callerInfo] = logEntry
  const displayLines: DisplayLine[] = []
  const timestamp = this.formatTimestamp(date)
  const callerSource = callerInfo ? `${callerInfo.fileName}:${callerInfo.lineNumber}` : 'unknown'
  const prefix = `[${timestamp}] [${level}]` + (this._debugModeEnabled ? ` [${callerSource}]` : '') + ' '
  const formattedArgs = this.formatArguments(args)
  const initialLines = formattedArgs.split('\n')
  for (let i = 0; i < initialLines.length; i++) {
    const lineText = initialLines[i]
    const isFirstLineOfEntry = i === 0
    const availableWidth = this.consoleWidth - 1 - (isFirstLineOfEntry ? 0 : INDENT_WIDTH)
    const linePrefix = isFirstLineOfEntry ? prefix : ' '.repeat(INDENT_WIDTH)
    const textToWrap = isFirstLineOfEntry ? linePrefix + lineText : lineText
    let currentPos = 0
    while (currentPos < textToWrap.length || (isFirstLineOfEntry && currentPos === 0 && textToWrap.length === 0)) {
      const segment = textToWrap.substring(currentPos, currentPos + availableWidth)
      const isFirstSegmentOfLine = currentPos === 0
      displayLines.push({
        text: isFirstSegmentOfLine && !isFirstLineOfEntry ? linePrefix + segment : segment,
        level: level,
        indent: !isFirstLineOfEntry || !isFirstSegmentOfLine,
      })
      currentPos += availableWidth
      if (isFirstLineOfEntry && currentPos === 0 && textToWrap.length === 0) break
    }
  }
  return displayLines
}
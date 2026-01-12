// @ts-nocheck
function extractCompleteSequences(buffer: string): { sequences: string[]; remainder: string } {
  const sequences: string[] = []
  let pos = 0
  while (pos < buffer.length) {
    const remaining = buffer.slice(pos)
    if (remaining.startsWith(ESC)) {
      let seqEnd = 1
      while (seqEnd <= remaining.length) {
        const candidate = remaining.slice(0, seqEnd)
        const status = isCompleteSequence(candidate)
        if (status === 'complete') {
          sequences.push(candidate)
          pos += seqEnd
          break
        } else if (status === 'incomplete') {
          seqEnd++
        } else {
          sequences.push(candidate)
          pos += seqEnd
          break
        }
      }
      if (seqEnd > remaining.length) {
        return { sequences, remainder: remaining }
      }
    } else {
      sequences.push(remaining[0])
      pos++
    }
  }

  return { sequences, remainder: '' }
}
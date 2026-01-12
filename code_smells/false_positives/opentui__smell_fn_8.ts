// @ts-nocheck
function isCompleteCsiSequence(data: string): 'complete' | 'incomplete' {
  if (!data.startsWith(ESC + '[')) {
    return 'complete'
  }
  if (data.length < 3) {
    return 'incomplete'
  }
  const payload = data.slice(2)
  const lastChar = payload[payload.length - 1]
  const lastCharCode = lastChar.charCodeAt(0)
  if (lastCharCode >= 0x40 && lastCharCode <= 0x7e) {
    if (payload.startsWith('<')) {
      const mouseMatch = /^<\d+;\d+;\d+[Mm]$/.test(payload)
      if (mouseMatch) {
        return 'complete'
      }
      if (lastChar === 'M' || lastChar === 'm') {
        const parts = payload.slice(1, -1).split(';')
        if (parts.length === 3 && parts.every((p) => /^\d+$/.test(p))) {
          return 'complete'
        }
      }
      return 'incomplete'
    }
    return 'complete'
  }
  return 'incomplete'
}
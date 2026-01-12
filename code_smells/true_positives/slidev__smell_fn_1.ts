// @ts-nocheck
function findRegion(lines: Array<string>, regionName: string) {
  let chosen: { re: (typeof markers)[number], start: number } | null = null
  for (let i = 0; i < lines.length; i++) {
    for (const re of markers) {
      if (re.start.exec(lines[i])?.[1] === regionName) {
        chosen = { re, start: i + 1 }
        break
      }
    }
    if (chosen)
      break
  }
  if (!chosen)
    return null
  let counter = 1
  for (let i = chosen.start; i < lines.length; i++) {
    if (chosen.re.start.exec(lines[i])?.[1] === regionName) {
      counter++
      continue
    }
    const endRegion = chosen.re.end.exec(lines[i])?.[1]
    if (endRegion === regionName || endRegion === '') {
      if (--counter === 0) {
        return {
          ...chosen,
          end: i,
        }
      }
    }
  }
  return null
}
// @ts-nocheck
function math_inline(state: any, silent: boolean) {
  let match, token, res, pos
  if (state.src[state.pos] !== '$')
    return false
  res = isValidDelim(state, state.pos)
  if (!res.can_open) {
    if (!silent)
      state.pending += '$'
    state.pos += 1
    return true
  }
  const start = state.pos + 1
  match = start
  while ((match = state.src.indexOf('$', match)) !== -1) {
    pos = match - 1
    while (state.src[pos] === '\\') pos -= 1

    if (((match - pos) % 2) === 1)
      break
    match += 1
  }
  if (match === -1) {
    if (!silent)
      state.pending += '$'
    state.pos = start
    return true
  }
  if (match - start === 0) {
    if (!silent)
      state.pending += '$$'
    state.pos = start + 1
    return true
  }
  res = isValidDelim(state, match)
  if (!res.can_close) {
    if (!silent)
      state.pending += '$'
    state.pos = start
    return true
  }
  if (!silent) {
    token = state.push('math_inline', 'math', 0)
    token.markup = '$'
    token.content = state.src.slice(start, match)
  }
  state.pos = match + 1
  return true
}
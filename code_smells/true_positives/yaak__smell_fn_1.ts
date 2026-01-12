// @ts-nocheck
export function tokenize(input: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  const n = input.length;
  const peek = () => input[i] ?? '';
  const advance = () => input[i++];
  const readWord = () => {
    let s = '';
    while (i < n && isIdent(peek())) s += advance();
    return s;
  };
  const readPhrase = () => {
    advance();
    let s = '';
    while (i < n) {
      const c = advance();
      if (c === `'`) break;
      if (c === '\\' && i < n) {
        const next = advance();
        s += next;
      } else {
        s += c;
      }
    }
    return s;
  };
  while (i < n) {
    const c = peek();
    if (isSpace(c)) {
      i++;
      continue;
    }
    if (c === '(') {
      toks.push({ kind: 'LPAREN' });
      i++;
      continue;
    }
    if (c === ')') {
      toks.push({ kind: 'RPAREN' });
      i++;
      continue;
    }
    if (c === ':') {
      toks.push({ kind: 'COLON' });
      i++;
      continue;
    }
    if (c === `'`) {
      const text = readPhrase();
      toks.push({ kind: 'PHRASE', text });
      continue;
    }
    if (c === '-') {
      toks.push({ kind: 'MINUS' });
      i++;
      continue;
    }
    if (isIdent(c)) {
      const w = readWord();
      const upper = w.toUpperCase();
      if (upper === 'AND') toks.push({ kind: 'AND' });
      else if (upper === 'OR') toks.push({ kind: 'OR' });
      else if (upper === 'NOT') toks.push({ kind: 'NOT' });
      else toks.push({ kind: 'WORD', text: w });
      continue;
    }
    i++;
  }
  toks.push({ kind: 'EOF' });
  return toks;
}
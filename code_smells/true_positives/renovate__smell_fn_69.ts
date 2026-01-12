// @ts-nocheck
function _compare_string(a: string, b: string): number {
  let charPos = 0;
  while (charPos < a.length || charPos < b.length) {
    const aChar = a.charAt(charPos);
    const bChar = b.charAt(charPos);
    if (numericChars.includes(aChar) && numericChars.includes(bChar)) {
      let aNumericEnd = charPos + 1;
      while (numericChars.includes(a.charAt(aNumericEnd))) {
        aNumericEnd += 1;
      }
      let bNumericEnd = charPos + 1;
      while (numericChars.includes(b.charAt(bNumericEnd))) {
        bNumericEnd += 1;
      }
      const numericCmp = a
        .substring(charPos, aNumericEnd)
        .localeCompare(b.substring(charPos, bNumericEnd), undefined, {
          numeric: true,
        });
      if (numericCmp !== 0) {
        return numericCmp;
      }
      charPos = aNumericEnd;
      continue;
    }
    if (aChar !== bChar) {
      const aPriority = characterOrder.indexOf(
        numericChars.includes(aChar) || aChar === '' ? ' ' : aChar,
      );
      const bPriority = characterOrder.indexOf(
        numericChars.includes(bChar) || bChar === '' ? ' ' : bChar,
      );
      return Math.sign(aPriority - bPriority);
    }
    charPos += 1;
  }
  return 0;
}
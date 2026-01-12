// @ts-nocheck
export function parseMavenBasedRange(input: string): MavenBasedRange | null {
  if (!input) {
    return null;
  }
  const matchGroups = mavenBasedRangeRegex.exec(input)?.groups;
  if (matchGroups) {
    const { leftBoundStr, separator, rightBoundStr } = matchGroups;
    let leftVal: string | null = matchGroups.leftVal;
    let rightVal: string | null = matchGroups.rightVal;
    if (!leftVal) {
      leftVal = null;
    }
    if (!rightVal) {
      rightVal = null;
    }
    const isVersionLeft = isString(leftVal) && isVersion(leftVal);
    const isVersionRight = isString(rightVal) && isVersion(rightVal);
    if (
      (leftVal === null || isVersionLeft) &&
      (rightVal === null || isVersionRight)
    ) {
      if (
        isVersionLeft &&
        isVersionRight &&
        leftVal &&
        rightVal &&
        compare(leftVal, rightVal) === 1
      ) {
        return null;
      }
      const leftBound = leftBoundStr.trim() === '[' ? 'inclusive' : 'exclusive';
      const rightBound =
        rightBoundStr.trim() === ']' ? 'inclusive' : 'exclusive';
      return {
        leftBound,
        leftBoundStr,
        leftVal,
        separator,
        rightBound,
        rightBoundStr,
        rightVal,
      };
    }
  }
  return null;
}
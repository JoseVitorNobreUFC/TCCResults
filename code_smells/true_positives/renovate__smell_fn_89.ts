// @ts-nocheck
function autoExtendMavenRange(
  currentRepresentation: string,
  newValue: string,
): string | null {
  const range = parseRange(currentRepresentation);
  if (!range) {
    return currentRepresentation;
  }
  const isPoint = (vals: Range[]): boolean => {
    if (vals.length !== 1) {
      return false;
    }
    const { leftType, leftValue, rightType, rightValue } = vals[0];
    return (
      leftType === 'INCLUDING_POINT' &&
      leftType === rightType &&
      leftValue === rightValue
    );
  };
  if (isPoint(range)) {
    return `[${newValue}]`;
  }
  const interval = [...range].reverse().find((elem) => {
    const { rightType, rightValue } = elem;
    return (
      rightValue === null ||
      (rightType === INCLUDING_POINT && compare(rightValue, newValue) === -1) ||
      (rightType === EXCLUDING_POINT && compare(rightValue, newValue) !== 1)
    );
  });
  if (!interval) {
    return currentRepresentation;
  }
  const { leftValue, rightValue } = interval;
  if (
    leftValue !== null &&
    rightValue !== null &&
    incrementRangeValue(leftValue) === rightValue
  ) {
    if (compare(newValue, leftValue) !== -1) {
      interval.leftValue = coerceRangeValue(leftValue, newValue);
      interval.rightValue = incrementRangeValue(interval.leftValue);
    }
  } else if (rightValue !== null) {
    if (interval.rightType === INCLUDING_POINT) {
      const tokens = tokenize(rightValue);
      const lastToken = tokens[tokens.length - 1];
      if (typeof lastToken.val === 'number') {
        interval.rightValue = coerceRangeValue(rightValue, newValue);
      } else {
        interval.rightValue = newValue;
      }
    } else {
      interval.rightValue = incrementRangeValue(
        coerceRangeValue(rightValue, newValue),
      );
    }
  } else if (leftValue !== null) {
    interval.leftValue = coerceRangeValue(leftValue, newValue);
  }
  return rangeToStr(range);
}
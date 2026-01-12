// @ts-nocheck
function tokenCmp(left: Token | null, right: Token | null): number {
  if (left === null) {
    if (right?.type === TokenType.String) {
      return 1;
    }
    return -1;
  }
  if (right === null) {
    if (left.type === TokenType.String) {
      return -1;
    }
    return 1;
  }
  if (left.type === TokenType.Number && right.type === TokenType.Number) {
    if (left.val < right.val) {
      return -1;
    }
    if (left.val > right.val) {
      return 1;
    }
  } else if (typeof left.val === 'string' && typeof right.val === 'string') {
    return stringTokenCmp(left.val, right.val);
  } else if (right.type === TokenType.Number) {
    return -1;
  } else if (left.type === TokenType.Number) {
    return 1;
  }
  return 0;
}
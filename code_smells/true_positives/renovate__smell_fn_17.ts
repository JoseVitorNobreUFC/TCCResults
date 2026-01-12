// @ts-nocheck
function _compare_glob(v1: string, v2: string): number {
  if (v1 === v2) {
    return 0;
  }
  const matchesv1 = v1.match(alphaNumPattern) ?? [];
  const matchesv2 = v2.match(alphaNumPattern) ?? [];
  const matches = Math.min(matchesv1.length, matchesv2.length);
  for (let i = 0; i < matches; i++) {
    const matchv1 = matchesv1[i];
    const matchv2 = matchesv2[i];
    if (matchv1?.startsWith('~') || matchv2?.startsWith('~')) {
      if (!matchv1?.startsWith('~')) {
        return 1;
      }
      if (!matchv2?.startsWith('~')) {
        return -1;
      }
    }
    if (isNumericString(matchv1?.[0])) {
      if (!isNumericString(matchv2?.[0])) {
        return 1;
      }
      const result = matchv1.localeCompare(matchv2, undefined, {
        numeric: true,
      });
      if (result === 0) {
        continue;
      }
      return Math.sign(result);
    } else if (isNumericString(matchv2?.[0])) {
      return -1;
    }
    const compared_value = this._compare_string(matchv1, matchv2);
    if (compared_value !== 0) {
      return compared_value;
    }
  }
  if (matchesv1.length === matchesv2.length) {
    return 0;
  }
  if (matchesv1.length > matches && matchesv1[matches].startsWith('~')) {
    return -1;
  }
  if (matchesv2.length > matches && matchesv2[matches].startsWith('~')) {
    return 1;
  }
  return matchesv1.length > matchesv2.length ? 1 : -1;
}
// @ts-nocheck
const compareVersionParts = (a: VersionParts, b: VersionParts): number => {
  const length = Math.max(a.main.length, b.main.length);
  for (let i = 0; i < length; i += 1) {
    const diff = (a.main[i] ?? 0) - (b.main[i] ?? 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }
  if (a.pre.length === 0 && b.pre.length === 0) return 0;
  if (a.pre.length === 0) return 1;
  if (b.pre.length === 0) return -1;
  const preLen = Math.max(a.pre.length, b.pre.length);
  for (let i = 0; i < preLen; i += 1) {
    const aToken = a.pre[i];
    const bToken = b.pre[i];
    if (aToken === undefined) return -1;
    if (bToken === undefined) return 1;
    if (typeof aToken === 'number' && typeof bToken === 'number') {
      if (aToken > bToken) return 1;
      if (aToken < bToken) return -1;
      continue;
    }
    if (typeof aToken === 'number') return -1;
    if (typeof bToken === 'number') return 1;
    if (aToken > bToken) return 1;
    if (aToken < bToken) return -1;
  }
  return 0;
};
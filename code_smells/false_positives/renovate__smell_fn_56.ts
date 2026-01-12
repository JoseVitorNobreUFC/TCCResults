// @ts-nocheck
function getNewValue({
  currentValue,
  rangeStrategy,
  currentVersion,
  newVersion,
}: NewValueConfig): string | null {
  const v = parseVersion(newVersion);
  if (!v) {
    return null;
  }
  if (this.isVersion(currentValue)) {
    return newVersion;
  }
  const r = parseRange(currentValue);
  if (!r) {
    return null;
  }
  if (this.isLessThanRange(newVersion, currentValue)) {
    return currentValue;
  }
  if (r.type === 'nuget-exact-range') {
    return rangeToString({ type: 'nuget-exact-range', version: v });
  }
  if (r.type === 'nuget-floating-range') {
    const floating = r.floating;
    if (!floating) {
      return versionToString(v);
    }
    const res: NugetFloatingRange = { ...r };
    if (floating === 'major') {
      res.major = coerceFloatingComponent(v.major);
      return tryBump(res, v, currentValue);
    }
    res.major = v.major;
    if (floating === 'minor') {
      res.minor = coerceFloatingComponent(v.minor);
      return tryBump(res, v, currentValue);
    }
    res.minor = v.minor ?? 0;
    if (floating === 'patch') {
      res.patch = coerceFloatingComponent(v.patch);
      return tryBump(res, v, currentValue);
    }
    res.patch = v.patch ?? 0;
    res.revision = coerceFloatingComponent(v.revision);
    return tryBump(res, v, currentValue);
  }
  const res: NugetBracketRange = { ...r };
  if (!r.max) {
    res.min = v;
    res.minInclusive = true;
    return rangeToString(res);
  }
  if (matches(v, r)) {
    return currentValue;
  }
  if (!r.min) {
    res.max = v;
    res.maxInclusive = true;
    return rangeToString(res);
  }
  res.max = v;
  res.maxInclusive = true;
  return rangeToString(res);
}
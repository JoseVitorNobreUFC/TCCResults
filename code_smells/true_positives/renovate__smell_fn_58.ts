// @ts-nocheck
export function rangeToString(range: NugetRange): string {
  if (range.type === 'nuget-exact-range') {
    return `[${versionToString(range.version)}]`;
  }
  if (range.type === 'nuget-floating-range') {
    const { major, minor, patch, revision, floating, prerelease } = range;
    let res = '';
    if (prerelease) {
      res = `-${prerelease}`;
    }
    if (revision !== undefined) {
      const revisionPart =
        floating === 'revision'
          ? floatingComponentToString(revision)
          : `${revision}`;
      res = `.${revisionPart}${res}`;
    }
    if (patch !== undefined) {
      const patchPart =
        floating === 'patch' ? floatingComponentToString(patch) : `${patch}`;
      res = `.${patchPart}${res}`;
    }
    if (minor !== undefined) {
      const minorPart =
        floating === 'minor' ? floatingComponentToString(minor) : `${minor}`;
      res = `.${minorPart}${res}`;
    }
    if (major !== undefined) {
      const majorPart =
        floating === 'major' ? floatingComponentToString(major) : `${major}`;
      res = `${majorPart}${res}`;
    }
    return res;
  }
  const { min, max, minInclusive, maxInclusive } = range;
  const leftBracket = minInclusive ? '[' : '(';
  const rightBracket = maxInclusive ? ']' : ')';
  if (min && max) {
    const minStr =
      min.type === 'nuget-version' ? versionToString(min) : rangeToString(min);
    const maxStr = versionToString(max);
    return `${leftBracket}${minStr},${maxStr}${rightBracket}`;
  }
  if (min) {
    const minStr =
      min.type === 'nuget-version' ? versionToString(min) : rangeToString(min);
    return `${leftBracket}${minStr},${rightBracket}`;
  }
  const maxStr = versionToString(max);
  return `${leftBracket},${maxStr}${rightBracket}`;
}
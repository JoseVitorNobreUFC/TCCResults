// @ts-nocheck
function toSemverRange(range: string): string | null {
  const fromParamMatch = fromParam.exec(range);
  if (fromParamMatch) {
    const [, version] = fromParamMatch;
    if (semver.valid(version)) {
      const nextMajor = `${semver.major(version) + 1}.0.0`;
      return `>=${version} <${nextMajor}`;
    }
    return null;
  }
  const fromRangeMatch = fromRange.exec(range);
  if (fromRangeMatch) {
    const [, version] = fromRangeMatch;
    if (semver.valid(version)) {
      return `>=${version}`;
    }
    return null;
  }
  const binaryRangeMatch = binaryRange.exec(range);
  if (binaryRangeMatch) {
    const [, currentVersion, op, newVersion] = binaryRangeMatch;
    if (semver.valid(currentVersion) && semver.valid(newVersion)) {
      return op === '..<'
        ? `>=${currentVersion} <${newVersion}`
        : `>=${currentVersion} <=${newVersion}`;
    }
    return null;
  }
  const toRangeMatch = toRange.exec(range);
  if (toRangeMatch) {
    const [, op, newVersion] = toRangeMatch;
    if (semver.valid(newVersion)) {
      return op === '..<' ? `<${newVersion}` : `<=${newVersion}`;
    }
  }
  return null;
}
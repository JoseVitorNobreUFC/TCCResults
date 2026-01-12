// @ts-nocheck
function extractLiteralVersion({
  version,
  depStartIndex,
  depSubContent,
  sectionKey,
}: {
  version: GradleVersionPointerTarget | undefined;
  depStartIndex: number;
  depSubContent: string;
  sectionKey: string;
}): VersionExtract {
  if (!version) {
    return { skipReason: 'unspecified-version' };
  } else if (isString(version)) {
    const fileReplacePosition =
      depStartIndex + findVersionIndex(depSubContent, sectionKey, version);
    return { currentValue: version, fileReplacePosition };
  } else if (isPlainObject(version)) {
    const versionKeys = ['require', 'prefer', 'strictly'];
    let found = false;
    let currentValue: string | undefined;
    let fileReplacePosition: number | undefined;
    if (version.reject || version.rejectAll) {
      return { skipReason: 'unsupported-version' };
    }
    for (const key of versionKeys) {
      if (key in version) {
        if (found) {
          return { skipReason: 'multiple-constraint-dep' };
        }
        found = true;
        currentValue = version[key] as string;
        fileReplacePosition =
          depStartIndex +
          findIndexAfter(depSubContent, sectionKey, currentValue);
      }
    }
    if (found) {
      return { currentValue, fileReplacePosition };
    }
  }
  return { skipReason: 'unspecified-version' };
}
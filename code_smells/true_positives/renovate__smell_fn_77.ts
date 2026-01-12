// @ts-nocheck
export function handleDepString(ctx: Ctx): Ctx {
  const stringTokens = loadFromTokenMap(ctx, 'templateStringTokens');
  const templateString = interpolateString(stringTokens, ctx);
  if (!templateString) {
    return ctx;
  }
  const dep = parseDependencyString(templateString);
  if (!dep) {
    return ctx;
  }
  let packageFile: string | undefined;
  let fileReplacePosition: number | undefined;
  for (const token of stringTokens) {
    if (token.type === 'symbol') {
      const varData = findVariable(token.value, ctx);
      if (varData) {
        packageFile = varData.packageFile;
        fileReplacePosition = varData.fileReplacePosition;
        if (varData.value === dep.currentValue) {
          dep.managerData = { fileReplacePosition, packageFile };
          dep.sharedVariableName = varData.key;
        }
      }
    }
  }
  if (!dep.managerData) {
    const lastToken = stringTokens[stringTokens.length - 1];
    if (
      lastToken?.type === 'string-value' &&
      dep.currentValue &&
      lastToken.value.includes(dep.currentValue)
    ) {
      packageFile = ctx.packageFile;
      if (stringTokens.length === 1) {
        fileReplacePosition = lastToken.offset + dep.depName!.length + 1;
      } else {
        fileReplacePosition =
          lastToken.offset + lastToken.value.lastIndexOf(dep.currentValue);
      }
      delete dep.sharedVariableName;
    } else {
      dep.skipReason = 'contains-variable';
    }
    dep.managerData = { fileReplacePosition, packageFile };
  }
  ctx.deps.push(dep);
  return ctx;
}
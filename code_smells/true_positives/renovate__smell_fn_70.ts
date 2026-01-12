// @ts-nocheck
function getDepWarnings(
  packageFiles: Record<string, PackageFile[]>,
): DepWarnings {
  const warnings: string[] = [];
  const warningFiles: string[] = [];
  for (const files of Object.values(packageFiles ?? {})) {
    for (const file of files ?? []) {
      if (file.packageFile) {
        for (const dep of coerceArray(file.deps)) {
          for (const w of coerceArray(dep.warnings)) {
            const message = w.message;
            if (!warnings.includes(message)) {
              warnings.push(message);
            }
            if (!warningFiles.includes(file.packageFile)) {
              warningFiles.push(file.packageFile);
            }
          }
        }
      }
    }
  }
  if (warnings.length) {
    logger.warn({ warnings, files: warningFiles }, 'Package lookup failures');
  }
  return { warnings, warningFiles };
}
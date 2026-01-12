// @ts-nocheck
export function sync(regexPattern: string, options: Options): string[] {
  const entries: string[] = [];
  const baseDir = options.baseDir ?? path.resolve(__dirname);
  const filePattern = new RegExp(regexPattern);
  walkSync(baseDir, {
    entryFilter: entry => {
      const relativePath = path.relative(baseDir, entry.path);
      const normalizedPath = relativePath.replace(/\\/g, '/');
      const fileTest = filePattern.test(normalizedPath);
      const ignoreTest = Array.isArray(options.ignore)
        ? options.ignore.some(ignore => ignore.test(normalizedPath))
        : options.ignore.test(normalizedPath);

      return fileTest && !ignoreTest;
    },
    errorFilter: error => {
      console.error(error);
      return false;
    },
  }).forEach(entry => entries.push(entry.path));
  return entries;
}
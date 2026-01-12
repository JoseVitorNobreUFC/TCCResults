// @ts-nocheck
export function extractTFLintPlugin(
  startingLine: number,
  lines: string[],
  pluginName: string,
): ExtractionResult {
  let lineNumber = startingLine;
  const deps: PackageDependency[] = [];
  let pluginSource: string | null = null;
  let currentVersion: string | null = null;
  let braceCounter = 0;
  do {
    if (lineNumber > lines.length - 1) {
      logger.debug(`Malformed TFLint configuration file detected.`);
    }
    const line = lines[lineNumber];
    if (isString(line)) {
      const openBrackets = (line.match(regEx(/\{/g)) ?? []).length;
      const closedBrackets = (line.match(regEx(/\}/g)) ?? []).length;
      braceCounter = braceCounter + openBrackets - closedBrackets;
      if (braceCounter === 1) {
        const kvMatch = keyValueExtractionRegex.exec(line);
        if (kvMatch?.groups) {
          if (kvMatch.groups.key === 'version') {
            currentVersion = kvMatch.groups.value;
          } else if (kvMatch.groups.key === 'source') {
            pluginSource = kvMatch.groups.value;
          }
        }
      }
    } else {
      braceCounter = 0;
    }
    lineNumber += 1;
  } while (braceCounter !== 0);
  const dep = analyseTFLintPlugin(pluginSource, currentVersion);
  deps.push(dep);
  lineNumber -= 1;
  return { lineNumber, dependencies: deps };
}
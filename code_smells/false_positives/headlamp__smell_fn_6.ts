// @ts-nocheck
const processedLogs = logs.map(log => {
  if (prettifyLogs && hasJsonLogs) {
    try {
      const jsonMatch = log.match(/(\{.*\})/);
      if (!jsonMatch) return log;
      const jsonStr = jsonMatch[1];
      const jsonObj = JSON.parse(jsonStr);
      const valueReplacer = formatJsonValues
        ? (key: string, value: any) =>
          typeof value === 'string' ? unescapeStringLiterals(value) : value
        : undefined;
      const prettyJson = JSON.stringify(jsonObj, valueReplacer, 2);
      const terminalReadyJson = formatJsonValues
        ? unescapeStringLiterals(prettyJson)
        : prettyJson;
      if (showTimestamps) {
        const timestamp = log.slice(0, jsonMatch.index).trim();
        return timestamp ? `${timestamp}\n${terminalReadyJson}\n` : `${terminalReadyJson}\n`;
      } else {
        return `${terminalReadyJson}\n`;
      }
    } catch {
      return log;
    }
  }
  return log;
});
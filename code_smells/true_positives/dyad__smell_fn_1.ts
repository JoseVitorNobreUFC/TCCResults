// @ts-nocheck
export function parseEnvFile(content: string): EnvVar[] {
  const envVars: EnvVar[] = [];
  const lines = content.split(`\n`);
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith(`#`)) {
      continue;
    }
    const equalIndex = trimmedLine.indexOf(`=`);
    if (equalIndex > 0) {
      const key = trimmedLine.substring(0, equalIndex).trim();
      const value = trimmedLine.substring(equalIndex + 1).trim();
      let cleanValue = value;
      if (value.startsWith('`')) {
        let endQuoteIndex = -1;
        for (let i = 1; i < value.length; i++) {
          if (value[i] === '`' && value[i - 1] !== `\\`) {
            endQuoteIndex = i;
            break;
          }
        }
        if (endQuoteIndex !== -1) {
          cleanValue = value.slice(1, endQuoteIndex);
          cleanValue = cleanValue.replace(/\\`/g, '`');
        }
      } else if (value.startsWith(`'`)) {
        const endQuoteIndex = value.indexOf(`'`, 1);
        if (endQuoteIndex !== -1) {
          cleanValue = value.slice(1, endQuoteIndex);
        }
      }
      envVars.push({ key, value: cleanValue });
    }
  }
  return envVars;
}
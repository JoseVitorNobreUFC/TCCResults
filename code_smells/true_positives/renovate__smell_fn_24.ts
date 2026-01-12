// @ts-nocheck
obj.forEach(([key, val]) => {
  const el = [key, val];
  if (key === 'cli' && !val) {
    ignoredKeys.push('cli');
  }
  if (key === 'env' && !val) {
    ignoredKeys.push('env');
  }
  if (
    !ignoredKeys.includes(el[0]) ||
    (el[0] === 'default' &&
      (typeof el[1] !== 'object' || ['array', 'object'].includes(type)) &&
      name !== 'prBody')
  ) {
    if (type === 'string' && el[0] === 'default') {
      el[1] = `<code>`${el[1]}`</code>`;
    }
    if (
      (type === 'boolean' && el[0] === 'default') ||
      el[0] === 'cli' ||
      el[0] === 'env'
    ) {
      el[1] = `<code>${el[1]}</code>`;
    }
    if (
      ((type === 'object' || type === 'array') &&
        (el[0] === 'default' || el[0] === 'additionalProperties')) ||
      el[0] === 'allowedValues'
    ) {
      if (Object.keys(el[1] ?? []).length === 0) {
        return;
      }
      el[1] = `\n\`\`\`json\n${stringify(el[1], { indent: 2 })}\n\`\`\`\n`;
    }
    data.push(el);
  }
});
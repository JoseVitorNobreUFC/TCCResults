// @ts-nocheck
  const validateJsonConfig = (value: string): string => {
    const baseErr = validateJson(value);
    if (baseErr) {
      return baseErr;
    }
    if (value.trim()) {
      try {
        const obj = JSON.parse(value);
        if (obj && typeof obj === 'object') {
          if (Object.prototype.hasOwnProperty.call(obj, 'mcpServers')) {
            return t('mcp.error.singleServerObjectRequired');
          }
          const typ = (obj as any)?.type;
          if (typ === 'stdio' && !(obj as any)?.command?.trim()) {
            return t('mcp.error.commandRequired');
          }
          if ((typ === 'http' || typ === 'sse') && !(obj as any)?.url?.trim()) {
            return t('mcp.wizard.urlRequired');
          }
        }
      } catch {}
    }
    return '';
  };
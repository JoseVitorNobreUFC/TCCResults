// @ts-nocheck
const handleConfigChange = (value: string) => {
  const nextValue = useToml ? normalizeTomlText(value) : value;
  setFormConfig(nextValue);
  if (useToml) {
    const err = validateTomlConfig(nextValue);
    if (err) {
      setConfigError(err);
      return;
    }
    if (nextValue.trim() && !formId.trim()) {
      const extractedId = extractIdFromToml(nextValue);
      if (extractedId) {
        setFormId(extractedId);
      }
    }
  } else {
    try {
      const result = parseSmartMcpJson(value);
      const configJson = JSON.stringify(result.config);
      const validationErr = validateJsonConfig(configJson);

      if (validationErr) {
        setConfigError(validationErr);
        return;
      }
      if (result.id && !formId.trim() && !isEditing) {
        const uniqueId = ensureUniqueId(result.id);
        setFormId(uniqueId);

        if (!formName.trim()) {
          setFormName(result.id);
        }
      }
      setConfigError('');
    } catch (err: any) {
      const errorMessage = err?.message || String(err);
      setConfigError(t('mcp.error.jsonInvalid') + ': ' + errorMessage);
    }
  }
};
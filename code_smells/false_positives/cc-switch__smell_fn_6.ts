// @ts-nocheck
useEffect(() => {
  if (isEditMode) {
    setCategory(initialCategory);
    return;
  }
  if (selectedPresetId === 'custom') {
    setCategory('custom');
    return;
  }
  if (!selectedPresetId) return;
  const match = selectedPresetId.match(/^(claude|codex|gemini)-(\d+)$/);
  if (!match) return;
  const [, type, indexStr] = match;
  const index = parseInt(indexStr, 10);
  if (type === 'codex' && appId === 'codex') {
    const preset = codexProviderPresets[index];
    if (preset) {
      setCategory(
        preset.category || (preset.isOfficial ? 'official' : undefined),
      );
    }
  } else if (type === 'claude' && appId === 'claude') {
    const preset = providerPresets[index];
    if (preset) {
      setCategory(
        preset.category || (preset.isOfficial ? 'official' : undefined),
      );
    }
  } else if (type === 'gemini' && appId === 'gemini') {
    const preset = geminiProviderPresets[index];
    if (preset) {
      setCategory(preset.category || undefined);
    }
  }
}, [appId, selectedPresetId, isEditMode, initialCategory]);
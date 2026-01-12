// @ts-nocheck
const customEndpointsMap = useMemo(() => {
  const urlSet = new Set<string>();
  const push = (raw?: string) => {
    const url = (raw || '').trim().replace(/\/+$/, '');
    if (url) urlSet.add(url);
  };
  for (const u of draftCustomEndpoints) push(u);
  if (selectedPresetId && selectedPresetId !== 'custom') {
    const entry = presetEntries.find((item) => item.id === selectedPresetId);
    if (entry) {
      const preset = entry.preset as any;
      if (Array.isArray(preset?.endpointCandidates)) {
        for (const u of preset.endpointCandidates as string[]) push(u);
      }
    }
  }
  if (appId === 'codex') {
    push(codexBaseUrl);
  } else {
    push(baseUrl);
  }
  const urls = Array.from(urlSet.values());
  if (urls.length === 0) {
    return null;
  }
  const now = Date.now();
  const customMap: Record<string, CustomEndpoint> = {};
  for (const url of urls) {
    if (!customMap[url]) {
      customMap[url] = { url, addedAt: now, lastUsed: undefined };
    }
  }
  return customMap;
}, []);
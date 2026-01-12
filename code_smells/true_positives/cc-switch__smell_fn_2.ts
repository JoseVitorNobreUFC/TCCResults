// @ts-nocheck
const loadSnippet = async () => {
  try {
    const snippet = await configApi.getCommonConfigSnippet('codex');
    if (snippet && snippet.trim()) {
      if (mounted) {
        setCommonConfigSnippetState(snippet);
      }
    } else {
      if (typeof window !== 'undefined') {
        try {
          const legacySnippet =
            window.localStorage.getItem(LEGACY_STORAGE_KEY);
          if (legacySnippet && legacySnippet.trim()) {
            await configApi.setCommonConfigSnippet('codex', legacySnippet);
            if (mounted) {
              setCommonConfigSnippetState(legacySnippet);
            }
            window.localStorage.removeItem(LEGACY_STORAGE_KEY);
            console.log(
              '[迁移] Codex 通用配置已从 localStorage 迁移到 config.json',
            );
          }
        } catch (e) {
          console.warn('[迁移] 从 localStorage 迁移失败:', e);
        }
      }
    }
  } catch (error) {
    console.error('加载 Codex 通用配置失败:', error);
  } finally {
    if (mounted) {
      setIsLoading(false);
    }
  }
};
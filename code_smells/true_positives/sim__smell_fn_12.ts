// @ts-nocheck
const loadAllChunks = useCallback(async () => {
  if (!knowledgeBaseId || !documentId || !isMounted) return
  try {
    setIsLoading(true)
    setError(null)
    const allChunksData: ChunkData[] = []
    let hasMore = true
    let offset = 0
    const limit = 50
    while (hasMore && isMounted) {
      const response = await fetch(
        `/api/knowledge/${knowledgeBaseId}/documents/${documentId}/chunks?limit=${limit}&offset=${offset}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch chunks')
      }
      const result = await response.json()
      if (result.success) {
        allChunksData.push(...result.data)
        hasMore = result.pagination.hasMore
        offset += limit
      } else {
        throw new Error(result.error || 'Failed to fetch chunks')
      }
    }
    if (isMounted) {
      setAllChunks(allChunksData)
      setChunks(allChunksData)
    }
  } catch (err) {
    if (isMounted) {
      setError(err instanceof Error ? err.message : 'Failed to load chunks')
    }
  } finally {
    if (isMounted) {
      setIsLoading(false)
    }
  }
}, [knowledgeBaseId, documentId, isMounted])
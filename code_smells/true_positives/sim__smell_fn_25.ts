// @ts-nocheck
async (searchQuery?: string) => {
  if (!selectedCredentialId) return
  setIsLoading(true)
  try {
    const queryParams = new URLSearchParams({
      credentialId: selectedCredentialId,
    })
    if (searchQuery) {
      queryParams.append('query', searchQuery)
    }
    let apiEndpoint: string
    if (provider === 'outlook') {
      apiEndpoint = `/api/tools/outlook/folders?${queryParams.toString()}`
    } else {
      apiEndpoint = `/api/tools/gmail/labels?${queryParams.toString()}`
    }
    const response = await fetch(apiEndpoint)
    if (response.ok) {
      const data = await response.json()
      const folderList = provider === 'outlook' ? data.folders : data.labels
      setFolders(folderList || [])
      if (selectedFolderId) {
        const folderInfo = folderList.find(
          (folder: FolderInfo) => folder.id === selectedFolderId
        )
        if (folderInfo) {
          setSelectedFolder(folderInfo)
          onFolderInfoChange?.(folderInfo)
        } else if (!searchQuery && provider !== 'outlook') {
          fetchFolderById(selectedFolderId)
        }
      }
    } else {
      logger.error('Error fetching folders:', {
        error: await response.text(),
      })
      setFolders([])
    }
  } catch (error) {
    logger.error('Error fetching folders:', { error })
    setFolders([])
  } finally {
    setIsLoading(false)
  }
}
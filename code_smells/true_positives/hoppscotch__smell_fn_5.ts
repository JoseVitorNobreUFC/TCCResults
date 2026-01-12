// @ts-nocheck
export function resolveSaveContextOnCollectionReorder(
  payload: {
    lastIndex: number
    newIndex: number
    folderPath: string
    length?: number
  },
  type: 'remove' | 'drop' = 'remove'
) {
  const { lastIndex, folderPath, length } = payload
  let { newIndex } = payload
  if (newIndex > lastIndex) newIndex--
  if (lastIndex === newIndex) return
  const affectedIndexes = getAffectedIndexes(
    lastIndex,
    newIndex === -1 ? length! : newIndex
  )
  if (newIndex === -1) {
    affectedIndexes.delete(lastIndex)
    if (type === 'remove') {
      resetSaveContextForAffectedRequests(
        folderPath ? `${folderPath}/${lastIndex}` : lastIndex.toString()
      )
    }
  }
  const affectedPaths = new Map<string, string>()
  for (const [key, value] of affectedIndexes) {
    if (folderPath) {
      affectedPaths.set(`${folderPath}/${key}`, `${folderPath}/${value}`)
    } else {
      affectedPaths.set(key.toString(), value.toString())
    }
  }
  const tabService = getService(RESTTabService)
  const tabs = tabService.getTabsRefTo((tab) => {
    return (
      tab.document.saveContext?.originLocation === 'user-collection' &&
      affectedPaths.has(tab.document.saveContext.folderPath)
    )
  })
  for (const tab of tabs) {
    if (tab.value.document.saveContext?.originLocation === 'user-collection') {
      const newPath = affectedPaths.get(
        tab.value.document.saveContext?.folderPath
      )!
      tab.value.document.saveContext.folderPath = newPath
    }
  }
}
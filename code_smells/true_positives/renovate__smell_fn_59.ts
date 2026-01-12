// @ts-nocheck
function reconcile(items: DockerHubTag[], expectedCount: number): boolean {
  let needNextPage = true;
  let earliestDate = null;
  let { updatedAt } = this.cache;
  let latestDate = updatedAt ? DateTime.fromISO(updatedAt) : null;
  for (const newItem of items) {
    const id = newItem.id;
    this.reconciledIds.add(id);
    const oldItem = this.cache.items[id];
    const itemDate = DateTime.fromISO(newItem.last_updated);
    if (!earliestDate || earliestDate > itemDate) {
      earliestDate = itemDate;
    }
    if (!latestDate || latestDate < itemDate) {
      latestDate = itemDate;
      updatedAt = newItem.last_updated;
    }
    if (dequal(oldItem, newItem)) {
      needNextPage = false;
      continue;
    }
    this.cache.items[newItem.id] = newItem;
    this.isChanged = true;
  }
  this.cache.updatedAt = updatedAt;
  if (earliestDate && latestDate) {
    for (const [key, item] of Object.entries(this.cache.items)) {
      const id = parseInt(key);
      const itemDate = DateTime.fromISO(item.last_updated);
      if (
        itemDate < earliestDate ||
        itemDate > latestDate ||
        this.reconciledIds.has(id)
      ) {
        continue;
      }
      delete this.cache.items[id];
      this.isChanged = true;
    }
    if (Object.keys(this.cache.items).length > expectedCount) {
      return true;
    }
  }
  return needNextPage;
}
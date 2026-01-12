// @ts-nocheck
export async function markMessageAsProcessed(
  key: string,
  expirySeconds: number = MESSAGE_ID_EXPIRY
): Promise<void> {
  try {
    const redis = getRedisClient()
    const fullKey = `${MESSAGE_ID_PREFIX}${key}`
    if (redis) {
      await redis.set(fullKey, '1', 'EX', expirySeconds)
    } else {
      const expiry = expirySeconds ? Date.now() + expirySeconds * 1000 : null
      inMemoryCache.set(fullKey, { value: '1', expiry })
      if (inMemoryCache.size > MAX_CACHE_SIZE) {
        const now = Date.now()
        for (const [cacheKey, entry] of inMemoryCache.entries()) {
          if (entry.expiry && entry.expiry < now) {
            inMemoryCache.delete(cacheKey)
          }
        }
        if (inMemoryCache.size > MAX_CACHE_SIZE) {
          const keysToDelete = Array.from(inMemoryCache.keys()).slice(
            0,
            inMemoryCache.size - MAX_CACHE_SIZE
          )
          for (const keyToDelete of keysToDelete) {
            inMemoryCache.delete(keyToDelete)
          }
        }
      }
    }
  } catch (error) {
    logger.error(`Error marking key ${key} as processed:`, { error })
    const fullKey = `${MESSAGE_ID_PREFIX}${key}`
    const expiry = expirySeconds ? Date.now() + expirySeconds * 1000 : null
    inMemoryCache.set(fullKey, { value: '1', expiry })
  }
}
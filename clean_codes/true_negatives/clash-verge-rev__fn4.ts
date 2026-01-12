// @ts-nocheck
const registerSharedPoller = (
  key: string,
  interval: number,
  callback: () => void,
  options: { refreshWhenHidden: boolean; refreshWhenOffline: boolean },
) => {
  let entry = sharedPollers.get(key);
  if (!entry) {
    entry = {
      subscribers: 0,
      timer: null,
      interval,
      callback,
      refreshWhenHidden: options.refreshWhenHidden,
      refreshWhenOffline: options.refreshWhenOffline,
    };
    sharedPollers.set(key, entry);
  }
  entry.subscribers += 1;
  entry.callback = callback;
  entry.interval = Math.min(entry.interval, interval);
  entry.refreshWhenHidden =
    entry.refreshWhenHidden || options.refreshWhenHidden;
  entry.refreshWhenOffline =
    entry.refreshWhenOffline || options.refreshWhenOffline;
  ensureTimer(key, entry);
  return () => {
    const current = sharedPollers.get(key);
    if (!current) return;
    current.subscribers -= 1;
    if (current.subscribers <= 0) {
      if (current.timer !== null) {
        clearInterval(current.timer);
      }
      sharedPollers.delete(key);
    }
  };
};
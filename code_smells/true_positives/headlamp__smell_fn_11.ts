// @ts-nocheck
function handleWebSocketMessage(event: MessageEvent): void {
  try {
    const data = JSON.parse(event.data);
    if (!data.clusterId || !data.path) {
      return;
    }
    const key = this.createKey(data.clusterId, data.path, data.query || '');
    if (data.type === 'COMPLETE') {
      this.completedPaths.add(key);
      return;
    }
    let update;
    try {
      update = data.data ? JSON.parse(data.data) : data;
    } catch (err) {
      console.error('Failed to parse update data:', err);
      return;
    }
    if (update && typeof update === 'object') {
      const listeners = this.listeners.get(key);
      if (listeners) {
        for (const listener of listeners) {
          try {
            listener(update);
          } catch (err) {
            console.error('Failed to process WebSocket message:', err);
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to process WebSocket message:', err);
  }
}
// @ts-nocheck
async function getRelatedPods(): Promise<Pod[]> {
  if (item instanceof Deployment || item instanceof ReplicaSet || item instanceof DaemonSet) {
    try {
      let labelSelector = '';
      const selector = item.spec.selector;
      if (selector.matchLabels) {
        labelSelector = Object.entries(selector.matchLabels)
          .map(([key, value]) => `${key}=${value}`)
          .join(',');
      }
      if (!labelSelector) {
        const resourceType =
          item instanceof Deployment
            ? 'deployment'
            : item instanceof ReplicaSet
              ? 'replicaset'
              : 'daemonset';
        throw new Error(
          t('translation|No label selectors found for this {{type}}', { type: resourceType })
        );
      }
      const response = await clusterFetch(
        `/api/v1/namespaces/${item.metadata.namespace}/pods?labelSelector=${labelSelector}`,
        { cluster: item.cluster }
      ).then(it => it.json());

      if (!response?.items) {
        throw new Error(t('translation|Invalid response from server'));
      }
      return response.items.map((podData: any) => new Pod(podData));
    } catch (error) {
      console.error('Error in getRelatedPods:', error);
      throw new Error(
        error instanceof Error ? error.message : t('translation|Failed to fetch related pods')
      );
    }
  }
  return [];
}
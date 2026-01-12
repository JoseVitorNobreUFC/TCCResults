// @ts-nocheck
async function storeKubeconfigFromBackstage(kubeconfig: string) {
  try {
    const decodedKubeconfig = atob(kubeconfig);
    const parsedKubeconfig = jsyaml.load(decodedKubeconfig) as KubeconfigObject;
    const promises = parsedKubeconfig.contexts.map(
      async (context: { name: string; context: { cluster: string; user: string } }) => {
        const cluster = parsedKubeconfig.clusters.find(
          (c: { name: string }) => c.name === context.context.cluster
        );
        const authInfo = parsedKubeconfig.users.find(
          (u: { name: string }) => u.name === context.context.user
        );
        if (!cluster || !authInfo) {
          console.warn(`Missing cluster or auth info for context ${context.name}`);
          return;
        }
        const newKubeconfig: KubeconfigObject = {
          apiVersion: parsedKubeconfig.apiVersion,
          kind: parsedKubeconfig.kind,
          preferences: parsedKubeconfig.preferences,
          'current-context': context.name,
          contexts: [context],
          clusters: [cluster],
          users: [authInfo],
        };
        const newKubeconfigYaml = jsyaml.dump(newKubeconfig, { lineWidth: -1 });
        const newKubeconfigBase64 = btoa(newKubeconfigYaml);
        await statelessFunctions.findAndReplaceKubeconfig(context.name, newKubeconfigBase64, true);
      }
    );
    console.log('Promises', promises);
    await Promise.all(promises);
  } catch (error) {
    console.error('Error storing kubeconfig from backstage:', error);
  }
}
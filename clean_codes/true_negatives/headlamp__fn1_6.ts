// @ts-nocheck
function makeDeployment(params: {
  name: string;
  namespace?: string;
  replicas?: number;
  readyReplicas?: number;
  labels?: Record<string, string>;
  cluster?: string;
}) {
  const {
    name,
    namespace = 'default',
    replicas = 1,
    readyReplicas = 1,
    labels = {},
    cluster,
  } = params;
  return new Deployment(
    {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: { name, namespace, uid: uid(name), labels },
      spec: { replicas, template: { spec: { containers: [] as any, nodeName: '' } } } as any,
      status: { readyReplicas } as any,
    } as any,
    cluster
  );
}
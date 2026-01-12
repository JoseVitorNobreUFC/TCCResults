// @ts-nocheck
accessorFn: resource => {
  const kind = resource.kind;
  if (kind === 'Deployment') {
    const deployment = resource as Deployment;
    const spec = deployment.spec;
    const status = deployment.status;
    if (status?.readyReplicas === 0) return 'Unhealthy';
    if ((status?.readyReplicas || 0) < (spec?.replicas || 0)) return 'Degraded';
  } else if (kind === 'StatefulSet') {
    const statefulSet = resource as StatefulSet;
    const spec = statefulSet.spec;
    const status = statefulSet.status;
    if (status?.readyReplicas === 0) return 'Unhealthy';
    if ((status?.readyReplicas || 0) < (spec?.replicas || 0)) return 'Degraded';
  } else if (kind === 'DaemonSet') {
    const daemonSet = resource as DaemonSet;
    const status = daemonSet.status;
    if (status?.numberReady === 0) return 'Unhealthy';
    if ((status?.numberReady || 0) < (status?.desiredNumberScheduled || 0))
      return 'Degraded';
  } else if (kind === 'Pod') {
    const pod = resource as Pod;
    const phase = pod.status?.phase;
    const conditions = pod.status?.conditions || [];
    const ready = conditions.find((c: any) => c.type === 'Ready')?.status === 'True';

    if (phase === 'Failed' || phase === 'CrashLoopBackOff') return 'Failed';
    if (phase === 'Pending' || !ready) return 'Pending';
  }
  return 'Healthy';
}
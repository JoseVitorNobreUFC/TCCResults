// @ts-nocheck
function extractWithYAMLParser(
  content: string,
  packageFile: string,
  config: ExtractConfig,
): PackageDependency[] {
  logger.trace('github-actions.extractWithYAMLParser()');
  const deps: PackageDependency[] = [];
  const obj = withMeta({ packageFile }, () => Workflow.parse(content));
  if (!obj) {
    return deps;
  }
  if ('runs' in obj && obj.runs.steps) {
    extractSteps(obj.runs.steps, deps);
  } else if ('jobs' in obj) {
    for (const job of Object.values(obj.jobs)) {
      if (job.container) {
        const dep = getDep(job.container, true, config.registryAliases);
        if (dep) {
          dep.depType = 'container';
          deps.push(dep);
        }
      }
      for (const service of job.services) {
        const dep = getDep(service, true, config.registryAliases);
        if (dep) {
          dep.depType = 'service';
          deps.push(dep);
        }
      }
      for (const runner of job['runs-on']) {
        const dep = extractRunner(runner);
        if (dep) {
          deps.push(dep);
        }
      }
      extractSteps(job.steps, deps);
    }
  }
  return deps;
}
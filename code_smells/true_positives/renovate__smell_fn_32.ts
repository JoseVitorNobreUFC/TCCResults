// @ts-nocheck
export function extractPackage(
  rawContent: string,
  packageFile: string,
  config: ExtractConfig,
): PackageFile | null {
  if (!rawContent) {
    return null;
  }
  const project = parsePom(rawContent, packageFile);
  if (!project) {
    return null;
  }
  const result: MavenInterimPackageFile = {
    datasource: MavenDatasource.id,
    packageFile,
    deps: [],
  };
  result.deps = deepExtract(project);
  const CNBDependencies = getAllCNBDependencies(project, config);
  if (CNBDependencies) {
    result.deps.push(...CNBDependencies);
  }
  const propsNode = project.childNamed('properties');
  const props: Record<string, MavenProp> = {};
  if (propsNode?.children) {
    for (const propNode of propsNode.children as XmlElement[]) {
      const key = propNode.name;
      const val = propNode?.val?.trim();
      if (key && val && propNode.position) {
        const fileReplacePosition = propNode.position;
        props[key] = { val, fileReplacePosition, packageFile };
      }
    }
  }
  result.mavenProps = props;
  const repositories = project.childNamed('repositories');
  if (repositories?.children) {
    const repoUrls: string[] = [];
    for (const repo of repositories.childrenNamed('repository')) {
      const repoUrl = repo.valueWithPath('url')?.trim();
      if (repoUrl) {
        repoUrls.push(repoUrl);
      }
    }
    result.deps.forEach((dep) => {
      if (isArray(dep.registryUrls)) {
        repoUrls.forEach((url) => dep.registryUrls!.push(url));
      }
    });
  }
  if (packageFile && project.childNamed('parent')) {
    const parentPath =
      project.valueWithPath('parent.relativePath')?.trim() ?? '../pom.xml';
    result.parent = resolveParentFile(packageFile, parentPath);
  }
  if (project.childNamed('version')) {
    result.packageFileVersion = project.valueWithPath('version')!.trim();
  }
  return result;
}
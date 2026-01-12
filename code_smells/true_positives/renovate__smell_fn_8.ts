// @ts-nocheck
export function extractPackageFile(content: string): PackageFileContent | null {
  const parsed = parseDepsEdnFile(content);
  if (!parsed) {
    return null;
  }
  const { data, metadata } = parsed;
  const deps: PackageDependency[] = [];
  const registryMap: Record<string, string> = {
    clojars: CLOJARS_REPO,
    central: MAVEN_REPO,
  };
  const mavenRepos = data['mvn/repos'];
  if (isPlainObject(mavenRepos)) {
    for (const [repoName, repoSpec] of Object.entries(mavenRepos)) {
      if (isString(repoName)) {
        if (isPlainObject(repoSpec) && isString(repoSpec.url)) {
          registryMap[repoName] = repoSpec.url;
        } else if (isString(repoSpec) && repoSpec === 'nil') {
          delete registryMap[repoName];
        }
      }
    }
  }
  const mavenRegistries: string[] = [...Object.values(registryMap)];
  deps.push(...extractSection(data.deps, metadata, mavenRegistries));
  const aliases = data.aliases;
  if (isPlainObject(aliases)) {
    for (const [depType, aliasSection] of Object.entries(aliases)) {
      if (isPlainObject(aliasSection)) {
        deps.push(
          ...extractSection(
            aliasSection['extra-deps'],
            metadata,
            mavenRegistries,
            depType,
          ),
        );
        deps.push(
          ...extractSection(
            aliasSection['override-deps'],
            metadata,
            mavenRegistries,
            depType,
          ),
        );
      }
    }
  }
  return { deps };
}
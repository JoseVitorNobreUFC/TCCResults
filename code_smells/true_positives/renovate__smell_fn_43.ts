// @ts-nocheck
function extractWithRegex(
  content: string,
  config: ExtractConfig,
): PackageDependency[] {
  const customRegistryUrlsPackageDependency =
    detectCustomGitHubRegistryUrlsForActions();
  logger.trace('github-actions.extractWithRegex()');
  const deps: PackageDependency[] = [];
  for (const line of content.split(newlineRegex)) {
    if (line.trim().startsWith('#')) {
      continue;
    }
    const dockerMatch = dockerActionRe.exec(line);
    if (dockerMatch) {
      const [, currentFrom] = dockerMatch;
      const dep = getDep(currentFrom, true, config.registryAliases);
      dep.depType = 'docker';
      deps.push(dep);
      continue;
    }
    const tagMatch = actionRe.exec(line);
    if (tagMatch?.groups) {
      const {
        depName,
        packageName,
        currentValue,
        path = '',
        tag,
        replaceString,
        registryUrl = '',
        commentWhiteSpaces = ' ',
      } = tagMatch.groups;
      let quotes = '';
      if (replaceString.includes(`'`)) {
        quotes = `'`;
      }
      if (replaceString.includes('`')) {
        quotes = '`';
      }
      const dep: PackageDependency = {
        depName,
        ...(packageName !== depName && { packageName }),
        commitMessageTopic: '{{{depName}}} action',
        datasource: GithubTagsDatasource.id,
        versioning: dockerVersioning.id,
        depType: 'action',
        replaceString,
        autoReplaceStringTemplate: `${quotes}{{depName}}${path}@{{#if newDigest}}{{newDigest}}${quotes}{{#if newValue}}${commentWhiteSpaces}# {{newValue}}{{/if}}{{/if}}{{#unless newDigest}}{{newValue}}${quotes}{{/unless}}`,
        ...(registryUrl
          ? detectDatasource(registryUrl)
          : customRegistryUrlsPackageDependency),
      };
      if (shaRe.test(currentValue)) {
        dep.currentValue = tag;
        dep.currentDigest = currentValue;
      } else if (shaShortRe.test(currentValue)) {
        dep.currentValue = tag;
        dep.currentDigestShort = currentValue;
      } else {
        dep.currentValue = currentValue;
      }
      deps.push(dep);
    }
  }
  return deps;
}
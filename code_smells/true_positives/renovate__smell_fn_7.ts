// @ts-nocheck
function getAuthJson(): string | null {
  const authJson: AuthJson = {};
  const githubHostRule = hostRules.find({
    hostType: 'github',
    url: 'https://api.github.com/',
  });
  const gitTagsHostRule = hostRules.find({
    hostType: GitTagsDatasource.id,
    url: 'https://github.com',
  });
  const selectedGithubToken = takePersonalAccessTokenIfPossible(
    isArtifactAuthEnabled(githubHostRule)
      ? findGithubToken(githubHostRule)
      : undefined,
    isArtifactAuthEnabled(gitTagsHostRule)
      ? findGithubToken(gitTagsHostRule)
      : undefined,
  );
  if (selectedGithubToken) {
    authJson['github-oauth'] = {
      'github.com': selectedGithubToken,
    };
  }
  for (const gitlabHostRule of hostRules.findAll({ hostType: 'gitlab' })) {
    if (!isArtifactAuthEnabled(gitlabHostRule)) {
      continue;
    }
    if (gitlabHostRule?.token) {
      const host = coerceString(gitlabHostRule.resolvedHost, 'gitlab.com');
      authJson['gitlab-token'] = authJson['gitlab-token'] ?? {};
      authJson['gitlab-token'][host] = gitlabHostRule.token;
      authJson['gitlab-domains'] = [
        host,
        ...(authJson['gitlab-domains'] ?? []),
      ];
    }
  }
  for (const packagistHostRule of hostRules.findAll({
    hostType: PackagistDatasource.id,
  })) {
    if (!isArtifactAuthEnabled(packagistHostRule)) {
      continue;
    }
    const { resolvedHost, username, password, token } = packagistHostRule;
    if (resolvedHost && username && password) {
      authJson['http-basic'] = authJson['http-basic'] ?? {};
      authJson['http-basic'][resolvedHost] = { username, password };
    } else if (resolvedHost && token) {
      authJson.bearer = authJson.bearer ?? {};
      authJson.bearer[resolvedHost] = token;
    }
  }
  return isEmptyObject(authJson) ? null : JSON.stringify(authJson);
}
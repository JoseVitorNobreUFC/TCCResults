// @ts-nocheck
export function takePersonalAccessTokenIfPossible(
  githubToken: string | undefined,
  gitTagsGithubToken: string | undefined,
): string | undefined {
  if (gitTagsGithubToken && isGithubPersonalAccessToken(gitTagsGithubToken)) {
    logger.debug('Using GitHub Personal Access Token (git-tags)');
    return gitTagsGithubToken;
  }
  if (githubToken && isGithubPersonalAccessToken(githubToken)) {
    logger.debug('Using GitHub Personal Access Token');
    return githubToken;
  }
  if (
    gitTagsGithubToken &&
    isGithubFineGrainedPersonalAccessToken(gitTagsGithubToken)
  ) {
    logger.debug('Using GitHub Fine-grained Personal Access Token (git-tags)');
    return gitTagsGithubToken;
  }
  if (githubToken && isGithubFineGrainedPersonalAccessToken(githubToken)) {
    logger.debug('Using GitHub Fine-grained Personal Access Token');
    return githubToken;
  }
  if (gitTagsGithubToken) {
    if (isGithubServerToServerToken(gitTagsGithubToken)) {
      logger.debug('Using GitHub Server-to-Server token (git-tags)');
    } else {
      logger.debug('Using unknown GitHub token type (git-tags)');
    }
    return gitTagsGithubToken;
  }
  if (githubToken) {
    if (isGithubServerToServerToken(githubToken)) {
      logger.debug('Using GitHub Server-to-Server token');
    } else {
      logger.debug('Using unknown GitHub token type');
    }
  }
  return githubToken;
}
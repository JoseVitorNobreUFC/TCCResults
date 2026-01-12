// @ts-nocheck
catch ((err): MavenFetchResult => {
  if (!(err instanceof HttpError)) {
    return Result.err({ type: 'unknown', err });
  }
  const failedUrl = url;
  if (err.message === HOST_DISABLED) {
    logger.trace({ failedUrl }, 'Host disabled');
    return Result.err({ type: 'host-disabled' });
  }
  if (isNotFoundError(err)) {
    logger.trace({ failedUrl }, `Url not found`);
    return Result.err({ type: 'not-found' });
  }
  if (isHostError(err)) {
    logger.debug(`Cannot connect to host ${failedUrl}`);
    return Result.err({ type: 'host-error' });
  }
  if (isPermissionsIssue(err)) {
    logger.debug(
      `Dependency lookup unauthorized. Please add authentication with a hostRule for ${failedUrl}`,
    );
    return Result.err({ type: 'permission-issue' });
  }
  if (isTemporaryError(err)) {
    logger.debug({ failedUrl, err }, 'Temporary error');
    if (getHost(url) === getHost(MAVEN_REPO)) {
      const statusCode = err?.response?.statusCode;
      if (statusCode === 429) {
        if (getCacheType() === 'redis') {
          logger.once.warn(
            { failedUrl },
            'Maven Central rate limiting detected despite Redis caching.',
          );
        } else {
          logger.once.warn(
            { failedUrl },
            'Maven Central rate limiting detected. Persistent caching required.',
          );
        }
      }
      return Result.err({ type: 'maven-central-temporary-error', err });
    } else {
      return Result.err({ type: 'temporary-error' });
    }
  }
  if (isConnectionError(err)) {
    logger.debug(`Connection refused to maven registry ${failedUrl}`);
    return Result.err({ type: 'connection-error' });
  }
  if (isUnsupportedHostError(err)) {
    logger.debug(`Unsupported host ${failedUrl}`);
    return Result.err({ type: 'unsupported-host' });
  }
  logger.info({ failedUrl, err }, 'Unknown HTTP download error');
  return Result.err({ type: 'unknown', err });
})
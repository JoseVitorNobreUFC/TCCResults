// @ts-nocheck
async function getManifestResponse(
  registryHost: string,
  dockerRepository: string,
  tag: string,
  mode: 'head' | 'getText' = 'getText',
): Promise<HttpResponse | null> {
  logger.debug(
    `getManifestResponse(${registryHost}, ${dockerRepository}, ${tag}, ${mode})`,
  );
  try {
    const headers = await getAuthHeaders(
      this.http,
      registryHost,
      dockerRepository,
    );
    if (!headers) {
      logger.warn('No docker auth found - returning');
      return null;
    }
    headers.accept = [
      'application/vnd.docker.distribution.manifest.list.v2+json',
      'application/vnd.docker.distribution.manifest.v2+json',
      'application/vnd.oci.image.manifest.v1+json',
      'application/vnd.oci.image.index.v1+json',
    ].join(', ');
    const url = `${registryHost}/v2/${dockerRepository}/manifests/${tag}`;
    const manifestResponse = await this.http[mode](url, {
      headers,
      noAuth: true,
      cacheProvider: memCacheProvider,
    });
    return manifestResponse;
  } catch (err) {
    if (err instanceof ExternalHostError) {
      throw err;
    }
    if (err.statusCode === 401) {
      logger.debug(
        { registryHost, dockerRepository },
        'Unauthorized docker lookup',
      );
      logger.debug({ err });
      return null;
    }
    if (err.statusCode === 404) {
      logger.debug(
        {
          err,
          registryHost,
          dockerRepository,
          tag,
        },
        'Docker Manifest is unknown',
      );
      return null;
    }
    if (err.statusCode === 429 && isDockerHost(registryHost)) {
      throw new ExternalHostError(err);
    }
    if (err.statusCode >= 500 && err.statusCode < 600) {
      throw new ExternalHostError(err);
    }
    if (err.code === 'ETIMEDOUT') {
      logger.debug(
        { registryHost },
        'Timeout when attempting to connect to docker registry',
      );
      logger.debug({ err });
      return null;
    }
    logger.debug(
      {
        err,
        registryHost,
        dockerRepository,
        tag,
      },
      'Unknown Error looking up docker manifest',
    );
    return null;
  }
}
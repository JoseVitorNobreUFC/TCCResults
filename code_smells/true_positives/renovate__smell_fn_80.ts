// @ts-nocheck
async function getReleases({
  packageName,
  registryUrl,
}: GetReleasesConfig): Promise<ReleaseResult | null> {
  if (!registryUrl) {
    return null;
  }
  let result: ReleaseResult | null = null;
  const pkgUrl = `${ensureTrailingSlash(
    registryUrl,
  )}api/packages/${packageName}`;
  let raw: HttpResponse<DartResult> | null = null;
  try {
    raw = await this.http.getJsonUnchecked<DartResult>(pkgUrl);
  } catch (err) {
    this.handleGenericErrors(err);
  }
  const body = raw?.body;
  if (body) {
    const { versions, latest } = body;
    const releases = versions
      ?.filter(({ retracted }) => !retracted)
      ?.map(({ version, published }) => ({
        version,
        releaseTimestamp: asTimestamp(published),
      }));
    if (releases && latest) {
      result = { releases };
      const pubspec = latest.pubspec;
      if (pubspec) {
        if (pubspec.homepage) {
          result.homepage = pubspec.homepage;
        }
        if (pubspec.repository) {
          result.sourceUrl = pubspec.repository;
        }
      }
    }
  }
  return result;
}
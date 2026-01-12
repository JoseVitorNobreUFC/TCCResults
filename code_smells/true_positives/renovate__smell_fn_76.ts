// @ts-nocheck
export function extractReleaseResult(
  ...composerReleasesArrays: ComposerReleases[]
): ReleaseResult | null {
  const releases: Release[] = [];
  let homepage: string | null | undefined;
  let sourceUrl: string | null | undefined;
  for (const composerReleasesArray of composerReleasesArrays) {
    for (const composerRelease of composerReleasesArray) {
      const version = composerRelease.version.replace(/^v/, '');
      const gitRef = composerRelease.version;
      const dep: Release = { version, gitRef };
      if (composerRelease.time) {
        dep.releaseTimestamp = composerRelease.time;
      }
      if (composerRelease.require?.php) {
        dep.constraints = { php: [composerRelease.require.php] };
      }
      releases.push(dep);
      if (!homepage && composerRelease.homepage) {
        homepage = composerRelease.homepage;
      }
      if (!sourceUrl && composerRelease.source?.url) {
        sourceUrl = composerRelease.source.url;
      }
    }
  }
  if (releases.length === 0) {
    return null;
  }
  const result: ReleaseResult = { releases };
  if (homepage) {
    result.homepage = homepage;
  }
  if (sourceUrl) {
    result.sourceUrl = sourceUrl;
  }
  return result;
}
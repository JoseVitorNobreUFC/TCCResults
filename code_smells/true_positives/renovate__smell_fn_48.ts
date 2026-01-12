// @ts-nocheck
async function resolvePluginReleases(
  rootUrl: string,
  artifact: string,
  scalaVersion: string,
): Promise<string[] | null> {
  const searchRoot = `${rootUrl}/${artifact}`;
  const hrefFilterMap = (href: string): string | null => {
    if (href.startsWith('.')) {
      return null;
    }
    return href;
  };
  const searchRootContent = await downloadHttpContent(
    this.http,
    ensureTrailingSlash(searchRoot),
  );
  if (searchRootContent) {
    const releases: string[] = [];
    const scalaVersionItems = extractPageLinks(
      searchRootContent,
      hrefFilterMap,
    );
    const scalaVersions = scalaVersionItems.map((x) =>
      x.replace(regEx(/^scala_/), ''),
    );
    const searchVersions = scalaVersions.includes(scalaVersion)
      ? [scalaVersion]
      : scalaVersions;
    for (const searchVersion of searchVersions) {
      const searchSubRoot = `${searchRoot}/scala_${searchVersion}`;
      const subRootContent = await downloadHttpContent(
        this.http,
        ensureTrailingSlash(searchSubRoot),
      );
      if (subRootContent) {
        const sbtVersionItems = extractPageLinks(
          subRootContent,
          hrefFilterMap,
        );
        for (const sbtItem of sbtVersionItems) {
          const releasesRoot = `${searchSubRoot}/${sbtItem}`;
          const releasesIndexContent = await downloadHttpContent(
            this.http,
            ensureTrailingSlash(releasesRoot),
          );
          if (releasesIndexContent) {
            const releasesParsed = extractPageLinks(
              releasesIndexContent,
              hrefFilterMap,
            );
            releasesParsed.forEach((x) => releases.push(x));
          }
        }
      }
    }
    if (releases.length) {
      return [...new Set(releases)].sort(compare);
    }
  }
  return null;
}

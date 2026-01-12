// @ts-nocheck
async function getReleases(
  http: Http,
  feedUrl: string,
  pkgName: string,
): Promise<ReleaseResult | null> {
  const dep: ReleaseResult = {
    releases: [],
  };
  let pkgUrlList: string | null = `${feedUrl.replace(
    regEx(/\/+$/),
    '',
  )}/FindPackagesById()?id=%27${pkgName}%27&$select=Version,IsLatestVersion,ProjectUrl,Published`;
  while (pkgUrlList !== null) {
    const pkgVersionsListRaw = await http.getText(pkgUrlList);
    const pkgVersionsListDoc = new XmlDocument(pkgVersionsListRaw.body);
    const pkgInfoList = pkgVersionsListDoc.childrenNamed('entry');
    for (const pkgInfo of pkgInfoList) {
      const version = this.getPkgProp(pkgInfo, 'Version');
      const releaseTimestamp = asTimestamp(
        this.getPkgProp(pkgInfo, 'Published'),
      );
      dep.releases.push({
        version: removeBuildMeta(`${version}`),
        releaseTimestamp,
      });
      try {
        const pkgIsLatestVersion = this.getPkgProp(
          pkgInfo,
          'IsLatestVersion',
        );
        if (pkgIsLatestVersion === 'true') {
          dep.tags = { latest: removeBuildMeta(`${version}`) };
          const projectUrl = this.getPkgProp(pkgInfo, 'ProjectUrl');
          if (projectUrl) {
            dep.sourceUrl = massageUrl(projectUrl);
          }
        }
      } catch (err) {
        logger.debug(
          { err, pkgName, feedUrl },
          `nuget registry failure: can't parse pkg info for project url`,
        );
      }
    }
    const nextPkgUrlListLink = pkgVersionsListDoc
      .childrenNamed('link')
      .find((node) => node.attr.rel === 'next');

    pkgUrlList = nextPkgUrlListLink ? nextPkgUrlListLink.attr.href : null;
  }
  if (dep.releases.length === 0) {
    return null;
  }
  return dep;
}
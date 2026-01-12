// @ts-nocheck
async function getUrls(
  searchRoot: string,
  artifactDirs: string[] | null,
  version: string | null,
): Promise<Partial<ReleaseResult>> {
  const result: Partial<ReleaseResult> = {};
  if (!artifactDirs?.length) {
    return result;
  }
  if (!version) {
    return result;
  }
  for (const artifactDir of artifactDirs) {
    const [artifact] = artifactDir.split('_');
    const pomFileNames = [
      `${artifactDir}-${version}.pom`,
      `${artifact}-${version}.pom`,
    ];
    for (const pomFileName of pomFileNames) {
      const pomUrl = `${searchRoot}/${artifactDir}/${version}/${pomFileName}`;
      const content = await downloadHttpContent(this.http, pomUrl);
      if (content) {
        const pomXml = new XmlDocument(content);

        const homepage = pomXml.valueWithPath('url');
        if (homepage) {
          result.homepage = homepage;
        }

        const sourceUrl = pomXml.valueWithPath('scm.url');
        if (sourceUrl) {
          result.sourceUrl = sourceUrl
            .replace(regEx(/^scm:/), '')
            .replace(regEx(/^git:/), '')
            .replace(regEx(/^git@github.com:/), 'https://github.com/')
            .replace(regEx(/\.git$/), '');
        }
        return result;
      }
    }
  }
  return result;
}
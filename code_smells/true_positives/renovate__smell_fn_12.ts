// @ts-nocheck
function extractFromSection(
  pubspec: Pubspec,
  sectionKey: keyof Pick<Pubspec, 'dependencies' | 'dev_dependencies'>,
): PackageDependency[] {
  const sectionContent = pubspec[sectionKey];
  if (!sectionContent) {
    return [];
  }
  const skippedPackages = [
    'flutter_driver',
    'flutter_localizations',
    'flutter_test',
    'flutter_web_plugins',
    'meta',
  ];
  const deps: PackageDependency[] = [];
  for (const depName of Object.keys(sectionContent)) {
    if (skippedPackages.includes(depName)) {
      continue;
    }
    let currentValue = sectionContent[depName];
    let skipReason: SkipReason | undefined;
    let registryUrls: string[] | undefined;
    let gitUrl: string | undefined;
    if (!isString(currentValue)) {
      const version = currentValue.version;
      const path = currentValue.path;
      const hosted = currentValue.hosted;
      const git = currentValue.git;
      if (isString(hosted)) {
        registryUrls = [hosted];
      } else if (isString(hosted?.url)) {
        registryUrls = [hosted.url];
      }
      if (isObject(git)) {
        gitUrl = git?.url;
      } else if (isString(git)) {
        gitUrl = git;
      }
      if (version) {
        currentValue = version;
      } else if (path) {
        currentValue = '';
        skipReason = 'path-dependency';
      } else if (isObject(git) && isString(git?.ref)) {
        currentValue = git.ref;
      } else if (isObject(git) && !isString(git?.ref) && !isString(version)) {
        currentValue = '';
        skipReason = 'unspecified-version';
      } else {
        currentValue = '';
      }
    }
    if (gitUrl === undefined) {
      deps.push({
        depName,
        depType: sectionKey,
        currentValue,
        datasource: DartDatasource.id,
        ...(registryUrls && { registryUrls }),
        skipReason,
      });
    } else {
      deps.push({
        depName,
        depType: sectionKey,
        packageName: gitUrl,
        datasource: GitRefsDatasource.id,
        currentValue,
        skipReason,
      });
    }
  }

  return deps;
}
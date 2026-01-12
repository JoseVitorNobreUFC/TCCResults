// @ts-nocheck
export function extractPackageFile(content: string): PackageFileContent | null {
  const sections = content.split(regEx(/def |\n\[/)).filter(
    (part) =>
      part.includes('python_requires') ||
      part.includes('build_require') || 
      part.includes('require'),
  );
  const deps: PackageDependency[] = [];
  for (const section of sections) {
    let depType = setDepType(section, 'requires');
    const rawLines = section.split('\n').filter(isNonEmptyString)
    for (const rawLine of rawLines) {
      if (!isComment(rawLine)) {
        depType = setDepType(rawLine, depType);
        const lines = rawLine.split(regEx(/[`'],/));
        for (const line of lines) {
          const matches = regex.exec(line.trim());
          if (matches?.groups) {
            let dep: PackageDependency = {};
            const depName = matches.groups?.name;
            const currentValue = matches.groups?.version.trim();
            let replaceString = `${depName}/${currentValue}`;
            let userAndChannel = '@_/_';
            if (matches.groups.userChannel) {
              userAndChannel = matches.groups.userChannel;
              replaceString = `${depName}/${currentValue}${userAndChannel}`;
              if (!userAndChannel.includes('/')) {
                userAndChannel = `${userAndChannel}/_`;
              }
            }
            const packageName = `${depName}/${currentValue}${userAndChannel}`;
            dep = {
              ...dep,
              depName,
              packageName,
              currentValue,
              replaceString,
              depType,
            };
            if (matches.groups.revision) {
              dep.currentDigest = matches.groups.revision;
              dep.autoReplaceStringTemplate = `{{depName}}/{{newValue}}${userAndChannel}{{#if newDigest}}#{{newDigest}}{{/if}}`;
              dep.replaceString = `${replaceString}#${dep.currentDigest}`;
            }
            deps.push(dep);
          }
        }
      }
    }
  }

  return deps.length ? { deps } : null;
}

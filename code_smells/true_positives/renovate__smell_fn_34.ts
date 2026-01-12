// @ts-nocheck
export function getAbandonedPackagesMd(
  packageFiles: Record<string, PackageFile[]>,
): string {
  const abandonedPackages: Record<
    string,
    Record<string, string | undefined | null>
  > = {};
  let abandonedCount = 0;
  for (const [manager, managerPackageFiles] of Object.entries(packageFiles)) {
    for (const packageFile of managerPackageFiles) {
      for (const dep of coerceArray(packageFile.deps)) {
        if (dep.depName && dep.isAbandoned) {
          abandonedCount++;
          abandonedPackages[manager] = abandonedPackages[manager] || {};
          abandonedPackages[manager][dep.depName] = dep.mostRecentTimestamp;
        }
      }
    }
  }
  if (abandonedCount === 0) {
    return '';
  }
  let abandonedMd = '> ℹ **Note**\n> \n';
  abandonedMd +=
    'These dependencies have not received updates for an extended period and may be unmaintained:\n\n';
  abandonedMd += '<details>\n';
  abandonedMd += `<summary>View abandoned dependencies (${abandonedCount})</summary>\n\n`;
  abandonedMd += '| Datasource | Name | Last Updated |\n';
  abandonedMd += '|------------|------|-------------|\n';
  for (const manager of Object.keys(abandonedPackages).sort()) {
    const deps = abandonedPackages[manager];
    for (const depName of Object.keys(deps).sort()) {
      const mostRecentTimestamp = deps[depName];
      const formattedDate = mostRecentTimestamp
        ? DateTime.fromISO(mostRecentTimestamp).toFormat('yyyy-MM-dd')
        : 'unknown';
      abandonedMd += `| ${manager} | \`${depName}\` | \`${formattedDate}\` |\n`;
    }
  }
  abandonedMd += '\n</details>\n\n';
  abandonedMd +=
    'Packages are marked as abandoned when they exceed the [`abandonmentThreshold`](https://docs.renovatebot.com/configuration-options/#abandonmentthreshold) since their last release.\n';
  abandonedMd +=
    'Unlike deprecated packages with official notices, abandonment is detected by release inactivity.\n\n';
  return abandonedMd + '\n';
}
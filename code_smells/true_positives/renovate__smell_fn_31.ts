// @ts-nocheck
function getDashboardMarkdownInternal(
  data: Map<string, Record<string, PackageFile[]> | null>,
): string {
  const none = 'None detected\n\n';
  const pad = data.size > 1;
  let deps = '';
  for (const [branch, packageFiles] of Array.from(data).sort(([a], [b]) =>
    a.localeCompare(b, undefined, { numeric: true }),
  )) {
    deps += pad
      ? `<details><summary>Branch ${branch}</summary>\n<blockquote>\n\n`
      : '';
    if (packageFiles === null) {
      deps += none;
      deps += pad ? '</blockquote>\n</details>\n\n' : '';
      continue;
    }
    const managers = Object.keys(packageFiles).sort();
    if (managers.length === 0) {
      deps += none;
      deps += pad ? '</blockquote>\n</details>\n\n' : '';
      continue;
    }
    for (const manager of managers) {
      deps += `<details><summary>${manager}</summary>\n<blockquote>\n\n`;
      for (const packageFile of Array.from(packageFiles[manager]).sort(
        (a, b) => a.packageFile.localeCompare(b.packageFile),
      )) {
        deps += `<details><summary>${packageFile.packageFile}</summary>\n\n`;
        for (const dep of packageFile.deps) {
          const ver = dep.currentValue;
          const digest = dep.currentDigest;
          const lock = dep.lockedVersion;
          let version;
          if (ver || digest) {
            version = ver && digest ? `${ver}@${digest}` : `${digest ?? ver}`;
          } else if (lock) {
            version = `lock file @ ${lock}`;
          } else {
            version = 'unknown version';
          }
          deps += ` - \`${dep.depName!} ${version}\`\n`;
        }
        deps += '\n</details>\n\n';
      }
      deps += `</blockquote>\n</details>\n\n`;
    }
    deps += pad ? '</blockquote>\n</details>\n\n' : '';
  }
  return deps;
}

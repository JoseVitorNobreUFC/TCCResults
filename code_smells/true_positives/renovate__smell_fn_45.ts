// @ts-nocheck
export function calculateLibYears(
  config: RenovateConfig,
  packageFiles?: Record<string, PackageFile[]>,
): void {
  if (!packageFiles) {
    return;
  }
  const allDeps: DepInfo[] = [];
  for (const [manager, files] of Object.entries(packageFiles)) {
    for (const file of files) {
      for (const dep of file.deps) {
        const depInfo: DepInfo = {
          depName: dep.depName!,
          manager,
          file: file.packageFile,
          datasource: dep.datasource!,
          version: (dep.currentVersion ?? dep.currentValue)!,
        };
        if (!dep.updates?.length) {
          allDeps.push(depInfo);
          continue;
        }
        depInfo.outdated = true;
        if (!dep.currentVersionTimestamp) {
          logger.once.debug(`No currentVersionTimestamp for ${dep.depName}`);
          allDeps.push(depInfo);
          continue;
        }
        const currentVersionDate = DateTime.fromISO(
          dep.currentVersionTimestamp,
        );
        for (const update of dep.updates) {
          if (!update.releaseTimestamp) {
            logger.once.debug(
              `No releaseTimestamp for ${dep.depName} update to ${update.newVersion}`,
            );
            continue;
          }
          const releaseDate = DateTime.fromISO(update.releaseTimestamp);
          const libYears = releaseDate.diff(currentVersionDate, 'years').years;
          if (libYears >= 0) {
            update.libYears = libYears;
          }
        }
        const depLibYears = Math.max(
          ...dep.updates.map((update) => update.libYears ?? 0),
          0,
        );
        depInfo.libYear = depLibYears;
        allDeps.push(depInfo);
      }
    }
  }
  const libYearsWithStatus = getLibYears(allDeps);
  logger.debug(libYearsWithStatus, 'Repository libYears');
  addLibYears(config, libYearsWithStatus);
}

export function calculateLibYears(
  config: RenovateConfig,
  packageFiles?: Record<string, PackageFile[]>,
): void {
  if (!packageFiles) return;

  const allDeps: DepInfo[] = [];

  const versionDate = (ts?: string) =>
    ts ? DateTime.fromISO(ts) : null;

  const computeUpdateLibYears = (dep: any, currentDate: any) => {
    for (const u of dep.updates ?? []) {
      if (!u.releaseTimestamp) {
        logger.once.debug(`No releaseTimestamp for ${dep.depName} update to ${u.newVersion}`);
        continue;
      }
      const rd = versionDate(u.releaseTimestamp);
      if (!rd) continue;
      const y = rd.diff(currentDate, 'years').years;
      if (y >= 0) u.libYears = y;
    }
    return Math.max(...(dep.updates ?? []).map(u => u.libYears ?? 0), 0);
  };

  for (const [manager, files] of Object.entries(packageFiles)) {
    for (const file of files) {
      for (const dep of file.deps) {
        const info: DepInfo = {
          depName: dep.depName!,
          manager,
          file: file.packageFile,
          datasource: dep.datasource!,
          version: (dep.currentVersion ?? dep.currentValue)!,
        };

        const updates = dep.updates;
        if (!updates?.length) {
          allDeps.push(info);
          continue;
        }

        info.outdated = true;

        const currDate = versionDate(dep.currentVersionTimestamp);
        if (!currDate) {
          logger.once.debug(`No currentVersionTimestamp for ${dep.depName}`);
          allDeps.push(info);
          continue;
        }

        info.libYear = computeUpdateLibYears(dep, currDate);
        allDeps.push(info);
      }
    }
  }

  const result = getLibYears(allDeps);
  logger.debug(result, 'Repository libYears');
  addLibYears(config, result);
}

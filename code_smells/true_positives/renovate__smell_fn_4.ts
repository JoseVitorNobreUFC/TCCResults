// @ts-nocheck
releaseResult.releases = filterMap(releaseResult.releases, (release) => {
  const releaseConstraints = release.constraints;
  delete release.constraints;
  if (!configConstraints || !releaseConstraints) {
    return release;
  }
  for (const [name, configConstraint] of Object.entries(configConstraints)) {
    if (!versioning.isValid(configConstraint)) {
      logger.once.warn(
        {
          packageName: config.packageName,
          constraint: configConstraint,
          versioning: versioningName,
        },
        'Invalid constraint used with strict constraintsFiltering',
      );
      continue;
    }
    const constraint = releaseConstraints[name];
    if (!isNonEmptyArray(constraint)) {
      continue;
    }
    let satisfiesConstraints = false;
    for (const releaseConstraint of constraint) {
      if (!releaseConstraint) {
        satisfiesConstraints = true;
        logger.once.debug(
          {
            packageName: config.packageName,
            versioning: versioningName,
            constraint: releaseConstraint,
          },
          'Undefined release constraint',
        );
        break;
      }
      if (!versioning.isValid(releaseConstraint)) {
        logger.once.debug(
          {
            packageName: config.packageName,
            versioning: versioningName,
            constraint: releaseConstraint,
          },
          'Invalid release constraint',
        );
        break;
      }
      if (configConstraint === releaseConstraint) {
        satisfiesConstraints = true;
        break;
      }
      if (versioning.subset?.(configConstraint, releaseConstraint)) {
        satisfiesConstraints = true;
        break;
      }
      if (versioning.matches(configConstraint, releaseConstraint)) {
        satisfiesConstraints = true;
        break;
      }
    }
    if (!satisfiesConstraints) {
      filteredReleases.push(release.version);
      return null;
    }
  }
  return release;
});
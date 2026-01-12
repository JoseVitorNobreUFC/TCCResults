// @ts-nocheck
map((x) => {
  const [packageNameString, requirements] = x;
  let depName = packageNameString;
  let currentValue: string | undefined;
  let nestedVersion = false;
  let skipReason: SkipReason | undefined;
  if (isObject(requirements)) {
    if (requirements.git) {
      skipReason = 'git-dependency';
    } else if (requirements.file) {
      skipReason = 'file-dependency';
    } else if (requirements.path) {
      skipReason = 'local-dependency';
    } else if (requirements.version) {
      currentValue = requirements.version;
      nestedVersion = true;
    } else {
      skipReason = 'unspecified-version';
    }
  } else {
    currentValue = requirements;
  }
  if (currentValue === '*') {
    skipReason = 'unspecified-version';
  }
  if (!skipReason) {
    const packageMatches = packageRegex.exec(packageNameString);
    if (packageMatches) {
      depName = packageMatches[1];
    } else {
      logger.debug(
        `Skipping dependency with malformed package name `${packageNameString}`.`,
      );
      skipReason = 'invalid-name';
    }
    const specifierMatches = specifierRegex.exec(currentValue!);
    if (!specifierMatches) {
      logger.debug(
        `Skipping dependency with malformed version specifier `${currentValue!}`.`,
      );
      skipReason = 'invalid-version';
    }
  }
  const dep: PackageDependency = {
    depType: sectionName,
    depName,
    packageName: normalizePythonDepName(depName),
    managerData: {},
  };
  if (currentValue) {
    dep.currentValue = currentValue;
  }
  if (skipReason) {
    dep.skipReason = skipReason;
  } else {
    dep.datasource = PypiDatasource.id;
  }
  if (!skipReason && currentValue?.startsWith('==')) {
    dep.currentVersion = currentValue.replace(regEx(/^==\s*/), '');
  }
  if (nestedVersion) {
    dep.managerData!.nestedVersion = nestedVersion;
  }
  if (sources && isObject(requirements) && requirements.index) {
    const source = sources.find((item) => item.name === requirements.index);
    if (source) {
      dep.registryUrls = [source.url];
    }
  }
  return dep;
})
// @ts-nocheck
async function extractLockedVersions(
  project: PyProject,
  deps: PackageDependency[],
  packageFile: string,
): Promise<PackageDependency[]> {
  const lockFileName = await findLocalSiblingOrParent(
    packageFile,
    this.lockfileName,
  );
  if (lockFileName === null) {
    logger.debug({ packageFile }, `No uv lock file found`);
  } else {
    const lockFileContent = await readLocalFile(lockFileName, 'utf8');
    if (lockFileContent) {
      const { val: lockFileMapping, err } = Result.parse(
        lockFileContent,
        UvLockfile,
      ).unwrap();

      if (err) {
        logger.debug({ packageFile, err }, `Error parsing uv lock file`);
      } else {
        for (const dep of deps) {
          const packageName = dep.packageName;
          if (packageName && packageName in lockFileMapping) {
            dep.lockedVersion = lockFileMapping[packageName];
          }
        }
      }
    }
  }
  return Promise.resolve(deps);
}
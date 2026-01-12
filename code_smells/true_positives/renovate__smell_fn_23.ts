// @ts-nocheck
export async function extractAllPackageFiles(
  config: ExtractConfig,
  packageFiles: string[],
): Promise<PackageFile<NpmManagerData>[]> {
  const npmFiles: PackageFile<NpmManagerData>[] = [];
  for (const packageFile of packageFiles) {
    const content = await readLocalFile(packageFile, 'utf8');
    if (content) {
      const parsedPnpmWorkspaceYaml = tryParsePnpmWorkspaceYaml(content);
      if (parsedPnpmWorkspaceYaml.success) {
        logger.trace(
          { packageFile },
          `Extracting file as a pnpm workspace YAML file`,
        );
        const deps = await extractPnpmWorkspaceFile(
          parsedPnpmWorkspaceYaml.data,
          packageFile,
        );
        if (deps) {
          npmFiles.push({
            ...deps,
            packageFile,
          });
        }
      } else {
        if (packageFile.endsWith('json')) {
          logger.trace({ packageFile }, `Extracting as a package.json file`);
          const deps = await extractPackageFile(content, packageFile, config);
          if (deps) {
            npmFiles.push({
              ...deps,
              packageFile,
            });
          }
        } else {
          logger.trace({ packageFile }, `Extracting as a .yarnrc.yml file`);
          const yarnConfig = loadConfigFromYarnrcYml(content);
          if (yarnConfig?.catalogs || yarnConfig?.catalog) {
            const hasPackageManagerResult = await hasPackageManager(
              upath.dirname(packageFile),
            );
            const catalogsDeps = await extractYarnCatalogs(
              { catalog: yarnConfig.catalog, catalogs: yarnConfig.catalogs },
              packageFile,
              hasPackageManagerResult,
            );
            if (catalogsDeps) {
              npmFiles.push({
                ...catalogsDeps,
                packageFile,
              });
            }
          }
        }
      }
    } else {
      logger.debug({ packageFile }, `No content found`);
    }
  }
  await postExtract(npmFiles);
  return npmFiles;
}
// @ts-nocheck
async function initialize(): Promise<void> {
  logger.info(`Initializing backup system...`);
  this.userDataPath = app.getPath(`userData`);
  this.backupBasePath = path.join(this.userDataPath, `backups`);
  logger.info(
    `Backup system paths - UserData: ${this.userDataPath}, Backups: ${this.backupBasePath}`,
  );
  const currentVersion = app.getVersion();
  const lastVersion = await this.getLastRunVersion();
  if (lastVersion === null) {
    logger.info(`No previous version found, skipping backup`);
    return;
  }
  if (lastVersion === currentVersion) {
    logger.info(
      `No version upgrade detected. Current version: ${currentVersion}`,
    );
    return;
  }
  await fs.mkdir(this.backupBasePath, { recursive: true });
  logger.debug(`Backup directory created/verified`);
  logger.info(`Version upgrade detected: ${lastVersion} → ${currentVersion}`);
  await this.createBackup(`upgrade_from_${lastVersion}`);
  await this.saveCurrentVersion(currentVersion);
  await this.cleanupOldBackups();
  logger.info(`Backup system initialized successfully`);
}
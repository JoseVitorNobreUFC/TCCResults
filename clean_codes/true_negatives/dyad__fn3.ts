// @ts-nocheck
async function listBackups(): Promise<BackupInfo[]> {
  try {
    const entries = await fs.readdir(this.backupBasePath, {
      withFileTypes: true,
    });
    const backups: BackupInfo[] = [];
    logger.debug(`Found ${entries.length} entries in backup directory`);
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const metadataPath = path.join(
          this.backupBasePath,
          entry.name,
          `backup.json`,
        );
        try {
          const metadataContent = await fs.readFile(metadataPath, `utf8`);
          const metadata: BackupMetadata = JSON.parse(metadataContent);
          backups.push({
            name: entry.name,
            ...metadata,
          });
        } catch (error) {
          logger.warn(`Invalid backup found: ${entry.name}`, error);
        }
      }
    }
    logger.info(`Found ${backups.length} valid backups`);
    return backups.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  } catch (error) {
    logger.error(`Failed to list backups:`, error);
    return [];
  }
}
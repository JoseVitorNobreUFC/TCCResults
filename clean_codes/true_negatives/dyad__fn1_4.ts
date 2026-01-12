// @ts-nocheck
export function initializeDatabase(): BetterSQLite3Database<typeof schema> & {
  $client: Database.Database;
} {
  if (_db) return _db as any;
  const dbPath = getDatabasePath();
  logger.log(`Initializing database at:`, dbPath);
  try {
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      if (stats.size < 100) {
        logger.log(`Database file exists but may be corrupted. Removing it...`);
        fs.unlinkSync(dbPath);
      }
    }
  } catch (error) {
    logger.error(`Error checking database file:`, error);
  }
  fs.mkdirSync(getUserDataPath(), { recursive: true });
  fs.mkdirSync(getDyadAppPath(`.`), { recursive: true });
  const sqlite = new Database(dbPath, { timeout: 10000 });
  sqlite.pragma(`foreign_keys = ON`);
  _db = drizzle(sqlite, { schema });
  try {
    const migrationsFolder = path.join(__dirname, `..`, `..`, `drizzle`);
    if (!fs.existsSync(migrationsFolder)) {
      logger.error(`Migrations folder not found:`, migrationsFolder);
    } else {
      logger.log(`Running migrations from:`, migrationsFolder);
      migrate(_db, { migrationsFolder });
    }
  } catch (error) {
    logger.error(`Migration error:`, error);
  }
  return _db as any;
}
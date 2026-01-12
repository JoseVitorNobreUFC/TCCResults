// @ts-nocheck
async (event, { appId }: GetAppEnvVarsParams) => {
  try {
    const app = await db.query.apps.findFirst({
      where: eq(apps.id, appId),
    });
    if (!app) {
      throw new Error(`App not found`);
    }
    const appPath = getDyadAppPath(app.path);
    const envFilePath = path.join(appPath, ENV_FILE_NAME);
    try {
      await fs.promises.access(envFilePath);
    } catch {
      return [];
    }
    const content = await fs.promises.readFile(envFilePath, `utf8`);
    const envVars = parseEnvFile(content);
    return envVars;
  } catch (error) {
    console.error(`Error getting app environment variables:`, error);
    throw new Error(
      `Failed to get environment variables: ${error instanceof Error ? error.message : `Unknown error`}`,
    );
  }
}
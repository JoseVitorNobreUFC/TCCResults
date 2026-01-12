// @ts-nocheck
  handle(`create-chat`, async (_, appId: number): Promise<number> => {
    const app = await db.query.apps.findFirst({
      where: eq(apps.id, appId),
      columns: {
        path: true,
      },
    });
    if (!app) {
      throw new Error(`App not found`);
    }
    let initialCommitHash = null;
    try {
      initialCommitHash = await git.resolveRef({
        fs,
        dir: getDyadAppPath(app.path),
        ref: `main`,
      });
    } catch (error) {
      logger.error(`Error getting git revision:`, error);
    }
    const [chat] = await db
      .insert(chats)
      .values({
        appId,
        initialCommitHash,
      })
      .returning();
    logger.info(
      `Created chat:`,
      chat.id,
      `for app:`,
      appId,
      `with initial commit hash:`,
      initialCommitHash,
    );
    return chat.id;
  });
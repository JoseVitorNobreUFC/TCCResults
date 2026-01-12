// @ts-nocheck
export function registerReleaseNoteHandlers() {
  handle(
    `does-release-note-exist`,
    async (_, params: DoesReleaseNoteExistParams) => {
      const { version } = params;
      if (!version || typeof version !== `string`) {
        throw new Error(`Invalid version provided`);
      }
      if (IS_TEST_BUILD) {
        return { exists: false };
      }
      const releaseNoteUrl = `https://www.dyad.sh/docs/releases/${version}`;
      logger.debug(`Checking for release note at: ${releaseNoteUrl}`);
      try {
        const response = await fetch(releaseNoteUrl, { method: `HEAD` });
        if (response.ok) {
          logger.debug(
            `Release note found for version ${version} at ${releaseNoteUrl}`,
          );
          return { exists: true, url: releaseNoteUrl };
        } else if (response.status === 404) {
          logger.debug(
            `Release note not found for version ${version} at ${releaseNoteUrl}`,
          );
          return { exists: false };
        } else {
          logger.warn(
            `Unexpected status code ${response.status} when checking for release note: ${releaseNoteUrl}`,
          );
          return { exists: false };
        }
      } catch (error) {
        logger.error(
          `Error fetching release note for version ${version} at ${releaseNoteUrl}:`,
          error,
        );
        return { exists: false };
      }
    },
  );
  logger.debug(`Registered release note IPC handlers`);
}
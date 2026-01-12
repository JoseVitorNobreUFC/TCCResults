// @ts-nocheck
export function registerNodeHandlers() {
  ipcMain.handle(`nodejs-status`, async (): Promise<NodeSystemInfo> => {
    logger.log(
      `handling ipc: nodejs-status for platform:`,
      platform(),
      `and arch:`,
      arch(),
    );
    const [nodeVersion, pnpmVersion] = await Promise.all([
      runShellCommand(`node --version`),
      runShellCommand(
        `pnpm --version || (corepack enable pnpm && pnpm --version) || (npm install -g pnpm@latest-10 && pnpm --version)`,
      ),
    ]);
    let nodeDownloadUrl = `https://nodejs.org/dist/v22.14.0/node-v22.14.0.pkg`;
    if (platform() == `win32`) {
      if (arch() === `arm64` || arch() === `arm`) {
        nodeDownloadUrl =
          `https://nodejs.org/dist/v22.14.0/node-v22.14.0-arm64.msi`;
      } else {
        nodeDownloadUrl =
          `https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi`;
      }
    }
    return { nodeVersion, pnpmVersion, nodeDownloadUrl };
  });

  ipcMain.handle(`reload-env-path`, async (): Promise<void> => {
    logger.debug(`Reloading env path, previously:`, process.env.PATH);
    if (platform() === `win32`) {
      const newPath = execSync(`cmd /c echo %PATH%`, {
        encoding: `utf8`,
      }).trim();
      process.env.PATH = newPath;
    } else {
      fixPath();
    }
    logger.debug(`Reloaded env path, now:`, process.env.PATH);
  });
}
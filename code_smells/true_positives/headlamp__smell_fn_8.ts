// @ts-nocheck
export function getPluginBinDirectories(pluginsDir: string): string[] {
  if (!fs.existsSync(pluginsDir)) {
    return [];
  }
  const binDirs: string[] = [];
  try {
    const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });
    const pluginFolders = entries.filter(entry => entry.isDirectory());
    for (const pluginFolder of pluginFolders) {
      if (!validPluginBinFolder(pluginFolder.name)) {
        continue;
      }
      const binDir = path.join(pluginsDir, pluginFolder.name, 'bin');
      if (fs.existsSync(binDir)) {
        if (process.platform !== 'win32') {
          try {
            const files = fs.readdirSync(binDir);
            for (const file of files) {
              const filePath = path.join(binDir, file);
              if (fs.statSync(filePath).isDirectory()) {
                continue;
              }
              fs.chmodSync(filePath, 0o755);
            }
          } catch (err) {
            console.error(`Error setting executable permissions in ${binDir}:`, err);
          }
        }
        binDirs.push(binDir);
      }
    }
  } catch (err) {
    console.error(`Error scanning plugin directories in ${pluginsDir}:`, err);
  }

  return binDirs;
}
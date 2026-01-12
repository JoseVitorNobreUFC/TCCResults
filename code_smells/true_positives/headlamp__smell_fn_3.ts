// @ts-nocheck
function list(folder = defaultPluginsDir(), progressCallback: null | ProgressCallback = null) {
  try {
    const pluginsData: PluginData[] = [];
    const entries = fs.readdirSync(folder, { withFileTypes: true });
    const pluginFolders = entries.filter(entry => entry.isDirectory());
    for (const pluginFolder of pluginFolders) {
      const pluginDir = path.join(folder, pluginFolder.name);
      if (checkValidPluginFolder(pluginDir)) {
        const packageJsonPath = path.join(pluginDir, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const pluginName = packageJson.name || pluginFolder.name;
        const pluginTitle = packageJson.artifacthub.title;
        const pluginVersion = packageJson.version || null;
        const artifacthubURL = packageJson.artifacthub ? packageJson.artifacthub.url : null;
        const repoName = packageJson.artifacthub ? packageJson.artifacthub.repoName : null;
        const author = packageJson.artifacthub ? packageJson.artifacthub.author : null;
        const artifacthubVersion = packageJson.artifacthub
          ? packageJson.artifacthub.version
          : null;
        pluginsData.push({
          pluginName,
          pluginTitle,
          pluginVersion,
          folderName: pluginFolder.name,
          artifacthubURL: artifacthubURL,
          repoName: repoName,
          author: author,
          artifacthubVersion: artifacthubVersion,
        });
      }
    }
    if (progressCallback) {
      progressCallback({ type: 'success', message: 'Plugins Listed', data: pluginsData });
    } else {
      return pluginsData;
    }
  } catch (e) {
    if (progressCallback) {
      progressCallback({ type: 'error', message: e instanceof Error ? e.message : String(e) });
    } else {
      throw e;
    }
  }
}
// @ts-nocheck
async function searchDefaultOnboardingPreset(
  repository: string,
): Promise<string | undefined> {
  let foundPreset: string | undefined;
  logger.debug('Checking for a default Renovate preset which can be used.');
  const repoPathParts = repository.split('/');
  for (
    let index = repoPathParts.length - 1;
    index >= 1 && !foundPreset;
    index--
  ) {
    const groupName = repoPathParts.slice(0, index).join('/');
    try {
      const repo = `${groupName}/renovate-config`;
      const preset = `local>${repo}`;
      logger.debug(`Checking for preset: ${preset}`);
      if (await getPreset({ repo })) {
        foundPreset = preset;
      }
    } catch (err) {
      if (
        err.message !== PRESET_DEP_NOT_FOUND &&
        !err.message.startsWith('Unsupported platform')
      ) {
        logger.warn({ err }, 'Unknown error fetching default owner preset');
      }
    }
  }
  if (!foundPreset) {
    const orgName = repoPathParts[0];
    const platform = GlobalConfig.get('platform')!;
    try {
      const repo = `${orgName}/.${platform}`;
      const presetName = 'renovate-config';
      const orgPresetName = `local>${repo}:${presetName}`;
      logger.debug(`Checking for preset: ${orgPresetName}`);
      if (
        await getPreset({
          repo,
          presetName,
        })
      ) {
        foundPreset = orgPresetName;
      }
    } catch (err) {
      if (
        err.message !== PRESET_DEP_NOT_FOUND &&
        !err.message.startsWith('Unsupported platform')
      ) {
        logger.warn({ err }, 'Unknown error fetching default owner preset');
      }
    }
  }
  return foundPreset;
}
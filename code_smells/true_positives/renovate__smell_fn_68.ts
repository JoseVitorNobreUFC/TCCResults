// @ts-nocheck
export async function fetchPreset({
  repo,
  filePreset,
  presetPath,
  endpoint: _endpoint,
  tag,
  fetch,
}: FetchPresetConfig): Promise<Nullish<Preset>> {
  const endpoint = ensureTrailingSlash(_endpoint!);
  const [fileName, presetName, subPresetName] = filePreset.split('/');
  const pathPrefix = presetPath ? `${presetPath}/` : '';
  const buildFilePath = (name: string): string => `${pathPrefix}${name}`;
  let jsonContent: any;
  if (fileName === 'default') {
    try {
      jsonContent = await fetch(
        repo,
        buildFilePath('default.json'),
        endpoint,
        tag,
      );
    } catch (err) {
      if (err.message !== PRESET_DEP_NOT_FOUND) {
        throw err;
      }
      jsonContent = await fetch(
        repo,
        buildFilePath('renovate.json'),
        endpoint,
        tag,
      );
      logger.warn(
        {
          repo,
          filePreset,
          presetPath,
          endpoint,
          tag,
        },
        'Fallback to renovate.json file as a preset is deprecated, please use a default.json file instead.',
      );
    }
  } else {
    jsonContent = await fetch(
      repo,
      buildFilePath(
        regEx(/\.json5?$/).test(fileName) ? fileName : `${fileName}.json`,
      ),
      endpoint,
      tag,
    );
  }
  if (!jsonContent) {
    throw new Error(PRESET_DEP_NOT_FOUND);
  }
  if (presetName) {
    const preset = jsonContent[presetName];
    if (!preset) {
      throw new Error(PRESET_NOT_FOUND);
    }
    if (subPresetName) {
      const subPreset = preset[subPresetName];
      if (!subPreset) {
        throw new Error(PRESET_NOT_FOUND);
      }
      return subPreset;
    }
    return preset;
  }
  return jsonContent;
}
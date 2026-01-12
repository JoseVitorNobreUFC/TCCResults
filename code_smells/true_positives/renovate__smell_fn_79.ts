// @ts-nocheck
export function setNpmrc(input?: string): void {
  if (input) {
    if (input === npmrcRaw) {
      return;
    }
    const existingNpmrc = npmrc;
    npmrcRaw = input;
    logger.debug('Setting npmrc');
    npmrc = ini.parse(input.replace(regEx(/\\n/g), '\n'));
    const exposeAllEnv = GlobalConfig.get('exposeAllEnv');
    for (const [key, val] of Object.entries(npmrc)) {
      if (
        !exposeAllEnv &&
        key.endsWith('registry') &&
        isString(val) &&
        val.includes('localhost')
      ) {
        logger.debug(
          { key, val },
          'Detected localhost registry - rejecting npmrc file',
        );
        npmrc = existingNpmrc;
        return;
      }
    }
    if (exposeAllEnv) {
      for (const key of Object.keys(npmrc)) {
        npmrc[key] = envReplace(npmrc[key]);
      }
    }
    const npmrcRules = convertNpmrcToRules(npmrc);
    if (npmrcRules.hostRules?.length) {
      npmrcRules.hostRules.forEach((hostRule) => hostRules.add(hostRule));
    }
    packageRules = npmrcRules.packageRules;
  } else if (npmrc) {
    logger.debug('Resetting npmrc');
    npmrc = {};
    npmrcRaw = '';
    packageRules = [];
  }
}
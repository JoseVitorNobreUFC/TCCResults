// @ts-nocheck
action((repositories: string[], opts: Record<string, unknown>) => {
  if (repositories?.length) {
    config.repositories = repositories;
  }
  for (const option of options) {
    if (option.cli !== false) {
      if (opts[option.name] !== undefined) {
        config[option.name] = opts[option.name];
        if (option.name === 'dryRun') {
          if (config[option.name] === 'true') {
            logger.warn(
              'cli config dryRun property has been changed to full',
            );
            config[option.name] = 'full';
          } else if (config[option.name] === 'false') {
            logger.warn(
              'cli config dryRun property has been changed to null',
            );
            config[option.name] = null;
          } else if (config[option.name] === 'null') {
            config[option.name] = null;
          }
        }
        if (option.name === 'requireConfig') {
          if (config[option.name] === 'true') {
            logger.warn(
              'cli config requireConfig property has been changed to required',
            );
            config[option.name] = 'required';
          } else if (config[option.name] === 'false') {
            logger.warn(
              'cli config requireConfig property has been changed to optional',
            );
            config[option.name] = 'optional';
          }
        }
      }
    }
  }
})
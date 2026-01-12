// @ts-nocheck
export function replaceInterpolatedValuesInObject(
  config_: RenovateConfig,
  input: Record<string, string>,
  options: InterpolatorOptions,
  deleteValues = true,
): RenovateConfig {
  const config = { ...config_ };
  const { name } = options;
  if (deleteValues) {
    delete config[name];
  }
  for (const [key, value] of Object.entries(config)) {
    if (isPlainObject(value)) {
      config[key] = replaceInterpolatedValuesInObject(
        value,
        input,
        options,
        deleteValues,
      );
    }
    if (isString(value)) {
      config[key] = replaceInterpolatedValuesInString(
        key,
        value,
        input,
        options,
      );
    }
    if (isArray(value)) {
      for (const [arrayIndex, arrayItem] of value.entries()) {
        if (isPlainObject(arrayItem)) {
          value[arrayIndex] = replaceInterpolatedValuesInObject(
            arrayItem,
            input,
            options,
            deleteValues,
          );
        } else if (isString(arrayItem)) {
          value[arrayIndex] = replaceInterpolatedValuesInString(
            key,
            arrayItem,
            input,
            options,
          );
        }
      }
    }
  }
  return config;
}
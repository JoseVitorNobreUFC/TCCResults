// @ts-nocheck
export function sanitizeValue(
  value: unknown,
  seen = new WeakMap<NestedValue, unknown>(),
): any {
  if (isString(value)) {
    return sanitize(sanitizeUrls(value));
  }
  if (isDate(value)) {
    return value;
  }
  if (isFunction(value)) {
    return '[function]';
  }
  if (isBuffer(value)) {
    return '[content]';
  }
  if (isError(value)) {
    const err = prepareError(value);
    return sanitizeValue(err, seen);
  }
  if (isArray(value)) {
    const length = value.length;
    const arrayResult = Array(length);
    seen.set(value, arrayResult);
    for (let idx = 0; idx < length; idx += 1) {
      const val = value[idx];
      arrayResult[idx] =
        isNested(val) && seen.has(val)
          ? seen.get(val)
          : sanitizeValue(val, seen);
    }
    return arrayResult;
  }
  if (isObject(value)) {
    const objectResult: Record<string, any> = {};
    seen.set(value, objectResult);
    for (const [key, val] of Object.entries<any>(value)) {
      let curValue: any;
      if (!val) {
        curValue = val;
      } else if (redactedFields.includes(key)) {
        if (isString(val) && regEx(/^{{\s*secrets\..*}}$/).test(val)) {
          curValue = val;
        } else {
          curValue = '***********';
        }
      } else if (contentFields.includes(key)) {
        curValue = '[content]';
      } else if (key === 'secrets') {
        curValue = {};
        Object.keys(val).forEach((secretKey) => {
          curValue[secretKey] = '***********';
        });
      } else {
        curValue = seen.has(val) ? seen.get(val) : sanitizeValue(val, seen);
      }

      const sanitizedKey = sanitizeValue(key, seen);
      objectResult[sanitizedKey] = curValue;
    }

    return objectResult;
  }

  return value;
}
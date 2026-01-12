// @ts-nocheck
function normalizeNoticeMessage(
  message: NoticeContent,
  params?: Record<string, unknown>,
  raw?: unknown,
): { message?: ReactNode; i18n?: NoticeTranslationDescriptor } {
  const rawText = raw !== undefined ? extractDisplayText(raw) : undefined;
  if (isValidElement(message)) {
    return { message };
  }
  if (isMaybeTranslationDescriptor(message)) {
    const originalParams = message.params ?? {};
    const mergedParams = Object.keys(params ?? {}).length
      ? { ...originalParams, ...params }
      : { ...originalParams };
    if (rawText !== undefined) {
      return {
        i18n: {
          key: 'shared.feedback.notices.prefixedRaw',
          params: {
            ...mergedParams,
            prefixKey: message.key,
            prefixParams: originalParams,
            message: rawText,
          },
        },
      };
    }
    return {
      i18n: {
        key: message.key,
        params: Object.keys(mergedParams).length ? mergedParams : undefined,
      },
    };
  }
  if (typeof message === 'string') {
    if (rawText !== undefined) {
      if (shouldUseTranslationKey(message, params)) {
        return {
          i18n: {
            key: 'shared.feedback.notices.prefixedRaw',
            params: {
              ...(params ?? {}),
              prefixKey: message,
              message: rawText,
            },
          },
        };
      }
      return {
        i18n: {
          key: 'shared.feedback.notices.prefixedRaw',
          params: {
            ...(params ?? {}),
            prefix: message,
            message: rawText,
          },
        },
      };
    }
    if (shouldUseTranslationKey(message, params)) {
      return {
        i18n: {
          key: message,
          params: params && Object.keys(params).length ? params : undefined,
        },
      };
    }
    return { i18n: createRawDescriptor(message) };
  }
  if (rawText !== undefined) {
    return { i18n: createRawDescriptor(rawText) };
  }
  const extracted = extractDisplayText(message);
  if (extracted !== undefined) {
    return { i18n: createRawDescriptor(extracted) };
  }
  return { i18n: createRawDescriptor('') };
}

// @ts-nocheck
export function formatSkillError(
  errorString: string,
  t: TFunction,
  defaultTitle: string = `skills.installFailed`,
): { title: string; description: string } {
  const parsedError = parseSkillError(errorString);
  if (!parsedError) {
    return {
      title: t(defaultTitle),
      description: errorString || t(`common.error`),
    };
  }
  const { code, context, suggestion } = parsedError;
  const errorKey = getErrorI18nKey(code);
  let description = t(errorKey, context);
  if (suggestion) {
    const suggestionKey = getSuggestionI18nKey(suggestion);
    const suggestionText = t(suggestionKey);
    description += `\n\n${suggestionText}`;
  }
  return {
    title: t(defaultTitle),
    description,
  };
}
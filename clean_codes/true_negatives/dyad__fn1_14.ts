// @ts-nocheck
export async function fetchApiTemplates(): Promise<Template[]> {
  if (apiTemplatesCache) {
    return apiTemplatesCache;
  }
  if (apiTemplatesFetchPromise) {
    return apiTemplatesFetchPromise;
  }
  apiTemplatesFetchPromise = (async (): Promise<Template[]> => {
    try {
      const response = await fetch(`https://api.dyad.sh/v1/templates`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch templates: ${response.status} ${response.statusText}`,
        );
      }
      const apiTemplates: ApiTemplate[] = await response.json();
      const convertedTemplates = apiTemplates.map(convertApiTemplate);
      apiTemplatesCache = convertedTemplates;
      return convertedTemplates;
    } catch (error) {
      logger.error(`Failed to fetch API templates:`, error);
      apiTemplatesFetchPromise = null;
      return [];
    }
  })();

  return apiTemplatesFetchPromise;
}
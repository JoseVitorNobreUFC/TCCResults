// @ts-nocheck
params: (params) => {
  const { credential, operation, properties, filter, sorts, ...rest } = params
  let parsedProperties
  if (
    (operation === 'notion_create_page' || operation === 'notion_create_database') &&
    properties
  ) {
    try {
      parsedProperties = JSON.parse(properties)
    } catch (error) {
      throw new Error(
        `Invalid JSON for properties: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }
  let parsedFilter
  if (operation === 'notion_query_database' && filter) {
    try {
      parsedFilter = JSON.parse(filter)
    } catch (error) {
      throw new Error(
        `Invalid JSON for filter: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }
  let parsedSorts
  if (operation === 'notion_query_database' && sorts) {
    try {
      parsedSorts = JSON.parse(sorts)
    } catch (error) {
      throw new Error(
        `Invalid JSON for sorts: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }
  return {
    ...rest,
    accessToken: credential,
    ...(parsedProperties ? { properties: parsedProperties } : {}),
    ...(parsedFilter ? { filter: JSON.stringify(parsedFilter) } : {}),
    ...(parsedSorts ? { sorts: JSON.stringify(parsedSorts) } : {}),
  }
}
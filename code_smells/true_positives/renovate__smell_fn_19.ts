// @ts-nocheck
async function queryRepoField<T = Record<string, unknown>>(
  query: string,
  fieldName: string,
  options: GraphqlOptions = {},
): Promise<T[]> {
  const result: T[] = [];
  const { paginate = true } = options;
  let optimalCount: null | number = null;
  let count = getGraphqlPageSize(
    fieldName,
    options.count ?? MAX_GRAPHQL_PAGE_SIZE,
  );
  let limit = options.limit ?? 1000;
  let cursor: string | null = null;
  let isIterating = true;
  while (isIterating) {
    const res = await this.requestGraphql<GithubGraphqlRepoData<T>>(query, {
      ...options,
      count: Math.min(count, limit),
      cursor,
      paginate,
    });
    const repositoryData = res?.data?.repository;
    if (
      isNonEmptyObject(repositoryData) &&
      !isNullOrUndefined(repositoryData[fieldName])
    ) {
      optimalCount = count;
      const {
        nodes = [],
        edges = [],
        pageInfo,
      } = repositoryData[fieldName] as GraphqlPaginatedContent<T>;
      result.push(...nodes);
      result.push(...edges);

      limit = Math.max(0, limit - nodes.length - edges.length);

      if (limit === 0) {
        isIterating = false;
      } else if (paginate && pageInfo) {
        const { hasNextPage, endCursor } = pageInfo;
        if (hasNextPage && endCursor) {
          cursor = endCursor;
        } else {
          isIterating = false;
        }
      }
    } else {
      count = Math.floor(count / 2);
      if (count === 0) {
        logger.warn({ query, options, res }, 'Error fetching GraphQL nodes');
        isIterating = false;
      }
    }
    if (!paginate) {
      isIterating = false;
    }
  }
  if (optimalCount && optimalCount < MAX_GRAPHQL_PAGE_SIZE) {
    setGraphqlPageSize(fieldName, optimalCount);
  }
  return result;
}
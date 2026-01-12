// @ts-nocheck
export async function findPr({
  branchName,
  prTitle,
  state = 'all',
  includeOtherAuthors,
}: FindPRConfig): Promise<Pr | null> {
  logger.debug(`findPr(${branchName}, ${prTitle}, ${state})`);
  if (includeOtherAuthors) {
    const prs = (
      await bitbucketHttp.getJsonUnchecked<PagedResult<PrResponse>>(
        `/2.0/repositories/${config.repository}/pullrequests?q=source.branch.name=`${branchName}`&state=open`,
        { cacheProvider: memCacheProvider },
      )
    ).body.values;
    if (prs.length === 0) {
      logger.debug(`No PR found for branch ${branchName}`);
      return null;
    }
    return utils.prInfo(prs[0]);
  }
  const prList = await getPrList();
  const pr = prList.find(
    (p) =>
      p.sourceBranch === branchName &&
      (!prTitle || p.title.toUpperCase() === prTitle.toUpperCase()) &&
      matchesState(p.state, state),
  );
  if (!pr) {
    return null;
  }
  logger.debug(`Found PR #${pr.number}`);
  if (pr.state === 'closed') {
    const reopenComments = await comments.reopenComments(config, pr.number);
    if (isNonEmptyArray(reopenComments)) {
      if (config.is_private) {
        logger.debug(
          `Found '${comments.REOPEN_PR_COMMENT_KEYWORD}' comment from workspace member. Renovate will reopen PR ${pr.number} as a new PR`,
        );
        return null;
      }
      for (const comment of reopenComments) {
        if (await isAccountMemberOfWorkspace(comment.user, config.repository)) {
          logger.debug(
            `Found '${comments.REOPEN_PR_COMMENT_KEYWORD}' comment from workspace member. Renovate will reopen PR ${pr.number} as a new PR`,
          );
          return null;
        }
      }
    }
  }
  return pr;
}
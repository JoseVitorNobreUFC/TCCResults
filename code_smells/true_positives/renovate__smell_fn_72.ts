// @ts-nocheck
export async function ensureComment({
  number,
  topic,
  content,
}: EnsureCommentConfig): Promise<boolean> {
  logger.debug(`ensureComment(${number}, ${topic!}, content)`);
  const header = topic ? `### ${topic}\n\n` : '';
  const body = `${header}${sanitize(content)}`;
  let prCommentsResponse: GetCommentsForPullRequestOutput;
  try {
    prCommentsResponse = await client.getPrComments(`${number}`);
  } catch (err) {
    logger.debug({ err }, 'Unable to retrieve pr comments');
    return false;
  }
  let commentId: string | undefined = undefined;
  let commentNeedsUpdating = false;
  if (!prCommentsResponse?.commentsForPullRequestData) {
    return false;
  }
  for (const commentObj of prCommentsResponse.commentsForPullRequestData) {
    if (!commentObj?.comments) {
      continue;
    }
    const firstCommentContent = commentObj.comments[0].content;
    if (
      (topic && firstCommentContent?.startsWith(header)) === true ||
      (!topic && firstCommentContent === body)
    ) {
      commentId = commentObj.comments[0].commentId;
      commentNeedsUpdating = firstCommentContent !== body;
      break;
    }
  }
  if (!commentId) {
    const prs = await getPrList();
    const thisPr = prs.filter((item) => item.number === number);

    if (!thisPr[0].sourceCommit || !thisPr[0].destinationCommit) {
      return false;
    }
    await client.createPrComment(
      `${number}`,
      config.repository,
      body,
      thisPr[0].destinationCommit,
      thisPr[0].sourceCommit,
    );
    logger.info(
      { repository: config.repository, prNo: number, topic },
      'Comment added',
    );
  } else if (commentNeedsUpdating && commentId) {
    await client.updateComment(commentId, body);

    logger.debug(
      { repository: config.repository, prNo: number, topic },
      'Comment updated',
    );
  } else {
    logger.debug(
      { repository: config.repository, prNo: number, topic },
      'Comment is already update-to-date',
    );
  }
  return true;
}
// @ts-nocheck
async function resolve({ ctx, input }) {
  const resumes = await ctx.prisma.resumesResume.findMany({
    select: {
      comments: {
        select: {
          userId: true,
          votes: {
            select: {
              value: true,
            },
          },
        },
      },
    },
  });
  let topUpvotedCommentCount = 0;
  for (const resume of resumes) {
    let highestVoteCount = 2;
    const commentUpvotePairs = [];
    for (const comment of resume.comments) {
      const { userId, votes } = comment;
      let voteCount = 0;
      for (const vote of votes) {
        if (vote.value === Vote.UPVOTE) {
          voteCount++;
        } else {
          voteCount--;
        }
      }
      if (voteCount >= highestVoteCount) {
        highestVoteCount = voteCount;
        commentUpvotePairs.push({ userId, voteCount });
      }
    }
    const userIds = commentUpvotePairs
      .filter((pair) => pair.voteCount === highestVoteCount)
      .map((pair) => pair.userId);
    if (userIds.includes(input.userId)) {
      topUpvotedCommentCount++;
    }
  }
  return topUpvotedCommentCount;
}
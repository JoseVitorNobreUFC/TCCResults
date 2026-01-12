// @ts-nocheck
export async function handleClosedPr(
  config: BranchConfig,
  pr: Pr,
): Promise<void> {
  if (pr.state === 'closed') {
    let content;
    const userStrings = config.userStrings!;
    if (config.updateType === 'major') {
      content = template.compile(userStrings.ignoreMajor, config);
    } else if (config.updateType === 'digest') {
      content = template.compile(userStrings.ignoreDigest, config);
    } else {
      content = template.compile(userStrings.ignoreOther, config);
    }
    content +=
      '\n\nIf you accidentally closed this PR, or if you changed your mind: rename this PR to get a fresh replacement PR.';
    if (!config.suppressNotifications!.includes('prIgnoreNotification')) {
      if (GlobalConfig.get('dryRun')) {
        logger.info(
          `DRY-RUN: Would ensure closed PR comment in PR #${pr.number}`,
        );
      } else {
        await ensureComment({
          number: pr.number,
          topic: userStrings.ignoreTopic,
          content,
        });
      }
    }
    if (await scm.branchExists(config.branchName)) {
      if (GlobalConfig.get('dryRun')) {
        logger.info('DRY-RUN: Would delete branch ' + config.branchName);
      } else {
        await scm.deleteBranch(config.branchName);
      }
    }
  }
}
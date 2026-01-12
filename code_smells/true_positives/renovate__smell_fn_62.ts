// @ts-nocheck
function compilePrTitle(
  upgrade: BranchUpgradeConfig,
  commitMessage: string,
): void {
  if (upgrade.prTitle) {
    upgrade.prTitle = template.compile(upgrade.prTitle, upgrade);
    upgrade.prTitle = template.compile(upgrade.prTitle, upgrade);
    upgrade.prTitle = template
      .compile(upgrade.prTitle, upgrade)
      .trim()
      .replace(regEx(/\s+/g), ' ');
    if (upgrade.prTitle !== sanitize(upgrade.prTitle)) {
      logger.debug(
        { branchName: upgrade.branchName },
        'Secrets were exposed in PR title',
      );
      throw new Error(CONFIG_SECRETS_EXPOSED);
    }
    if (upgrade.toLowerCase && upgrade.commitMessageLowerCase !== 'never') {
      upgrade.prTitle = upgrade.prTitle.toLowerCase();
    }
  } else {
    [upgrade.prTitle] = commitMessage.split(newlineRegex);
  }
  if (!upgrade.prTitleStrict) {
    upgrade.prTitle += upgrade.hasBaseBranches ? ' ({{baseBranch}})' : '';
    if (upgrade.isGroup) {
      upgrade.prTitle +=
        upgrade.updateType === 'major' && upgrade.separateMajorMinor
          ? ' (major)'
          : '';
      upgrade.prTitle +=
        upgrade.updateType === 'minor' && upgrade.separateMinorPatch
          ? ' (minor)'
          : '';
      upgrade.prTitle +=
        upgrade.updateType === 'patch' && upgrade.separateMinorPatch
          ? ' (patch)'
          : '';
    }
  }
  upgrade.prTitle = template.compile(upgrade.prTitle, upgrade);
  logger.trace(`prTitle: ` + JSON.stringify(upgrade.prTitle));
}
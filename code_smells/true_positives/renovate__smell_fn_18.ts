// @ts-nocheck
export function find(search: HostRuleSearch): CombinedHostRule {
  if ([search.hostType, search.url].every(isFalsy)) {
    logger.warn({ search }, 'Invalid hostRules search');
    return {};
  }
  const sortedRules = hostRules
    .sort(fromShorterToLongerMatchHost)
    .sort(fromLowerToHigherRank);
  const matchedRules: HostRule[] = [];
  for (const rule of sortedRules) {
    let hostTypeMatch = true;
    let hostMatch = true;
    let readOnlyMatch = true;
    if (rule.hostType) {
      hostTypeMatch = false;
      if (search.hostType === rule.hostType) {
        hostTypeMatch = true;
      }
    }
    if (rule.matchHost && rule.resolvedHost) {
      hostMatch = false;
      if (search.url) {
        hostMatch = matchesHost(search.url, rule.matchHost);
      }
    }
    if (!isUndefined(rule.readOnly)) {
      readOnlyMatch = false;
      if (search.readOnly === rule.readOnly) {
        readOnlyMatch = true;
        hostTypeMatch = true;
      }
    }
    if (hostTypeMatch && readOnlyMatch && hostMatch) {
      matchedRules.push(clone(rule));
    }
  }
  const res: HostRule = Object.assign({}, ...matchedRules);
  delete res.hostType;
  delete res.resolvedHost;
  delete res.matchHost;
  delete res.readOnly;
  return res;
}
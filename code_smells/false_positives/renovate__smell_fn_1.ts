// @ts-nocheck
function run(value: (LegacyHostRule & HostRule)[]): void {
  const newHostRules: HostRule[] = [];
  for (const hostRule of value) {
    validateHostRule(hostRule);
    const newRule: any = {};
    for (const [key, value] of Object.entries(hostRule)) {
      if (key === 'platform') {
        if (isString(value)) {
          newRule.hostType ??= value;
        }
        continue;
      }
      if (key === 'matchHost') {
        if (isString(value)) {
          newRule.matchHost ??= massageHostUrl(value);
        }
        continue;
      }
      if (key === 'hostType') {
        if (isString(value)) {
          newRule.hostType ??= migrateDatasource(value);
        }
        continue;
      }
      if (
        key === 'endpoint' ||
        key === 'host' ||
        key === 'baseUrl' ||
        key === 'hostName' ||
        key === 'domainName'
      ) {
        if (isString(value)) {
          newRule.matchHost ??= massageHostUrl(value);
        }
        continue;
      }
      newRule[key] = value;
    }
    newHostRules.push(newRule);
  }
  this.rewrite(newHostRules);
}
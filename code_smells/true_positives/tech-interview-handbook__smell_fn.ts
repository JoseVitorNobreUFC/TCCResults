// @ts-nocheck
export function createAggregatedQuestionEncounter(
  encounters: AggregatableEncounters,
): AggregatedQuestionEncounter {
  const countryCounts: Record<string, CountryInfo> = {};
  const companyCounts: Record<string, number> = {};
  const roleCounts: Record<string, number> = {};
  for (const encounter of encounters) {
    if (encounter.company !== null) {
      if (!(encounter.company.name in companyCounts)) {
        companyCounts[encounter.company!.name] = 0;
      }
      companyCounts[encounter.company!.name] += 1;
    }
    if (encounter.country !== null) {
      if (!(encounter.country.name in countryCounts)) {
        countryCounts[encounter.country.name] = {
          stateInfos: {},
          total: 0,
        };
      }
      const countryInfo = countryCounts[encounter.country.name];
      countryInfo.total += 1;
      const countryStateInfo = countryInfo.stateInfos;
      if (encounter.state !== null) {
        if (!(encounter.state.name in countryStateInfo)) {
          countryStateInfo[encounter.state.name] = {
            cityCounts: {},
            total: 0,
          };
        }
        const stateInfo = countryStateInfo[encounter.state.name];
        stateInfo.total += 1;
        const { cityCounts } = stateInfo;
        if (encounter.city !== null) {
          if (!(encounter.city.name in cityCounts)) {
            cityCounts[encounter.city.name] = 0;
          }
          cityCounts[encounter.city.name] += 1;
        }
      }
    }
    if (!(encounter.role in roleCounts)) {
      roleCounts[encounter.role] = 0;
    }
    roleCounts[encounter.role] += 1;
  }
  return {
    companyCounts,
    countryCounts,
    roleCounts,
  };
}
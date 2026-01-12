// @ts-nocheck
handle(`get-user-budget`, async (): Promise<UserBudgetInfo | null> => {
  if (IS_TEST_BUILD) {
    return null;
  }
  logger.info(`Attempting to fetch user budget information.`);
  const settings = readSettings();
  const apiKey = settings.providerSettings?.auto?.apiKey?.value;
  if (!apiKey) {
    logger.error(`LLM Gateway API key (Dyad Pro) is not configured.`);
    return null;
  }
  const url = `https://llm-gateway.dyad.sh/user/info`;
  const headers = {
    'Content-Type': `application/json`,
    Authorization: `Bearer ${apiKey}`,
  };
  try {
    const response = await fetch(url, {
      method: `GET`,
      headers: headers,
    });
    if (!response.ok) {
      const errorBody = await response.text();
      logger.error(
        `Failed to fetch user budget. Status: ${response.status}. Body: ${errorBody}`,
      );
      return null;
    }
    const data = await response.json();
    const userInfoData = data[`user_info`];
    logger.info(`Successfully fetched user budget information.`);
    return UserBudgetInfoSchema.parse({
      usedCredits: userInfoData[`spend`] * CONVERSION_RATIO,
      totalCredits: userInfoData[`max_budget`] * CONVERSION_RATIO,
      budgetResetDate: new Date(userInfoData[`budget_reset_at`]),
    });
  } catch (error: any) {
    logger.error(`Error fetching user budget: ${error.message}`, error);
    return null;
  }
});
// @ts-nocheck
async function getModels() {
  if (proxyUrl) {
    try {
      const response = await fetch(`${proxyUrl}/model/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new HttpException(
          `Failed to fetch models from proxy: ${response.statusText}`,
          HttpStatus.BAD_GATEWAY,
        );
      }
      const proxyModels = await response.json();
      const models: BytebotAgentModel[] = proxyModels.data.map(
        (model: any) => ({
          provider: 'proxy',
          name: model.litellm_params.model,
          title: model.model_name,
          contextWindow: 128000,
        }),
      );
      return models;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error fetching models: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  return models;
}
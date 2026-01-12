// @ts-nocheck
export const getIpInfo = async (): Promise<IpInfo> => {
  const maxRetries = 3;
  const serviceTimeout = 5000;
  const overallTimeout = 20000;
  const overallTimeoutController = new AbortController();
  const overallTimeoutId = setTimeout(() => {
    overallTimeoutController.abort();
  }, overallTimeout);
  try {
    const shuffledServices = shuffleServices();
    let lastError: Error | null = null;
    for (const service of shuffledServices) {
      debugLog(`尝试IP检测服务: ${service.url}`);
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        try {
          const timeoutController = new AbortController();
          timeoutId = setTimeout(() => {
            timeoutController.abort();
          }, service.timeout || serviceTimeout);
          console.debug(`Fetching IP information...`);
          const response = await fetch(service.url, {
            method: `GET`,
            signal: timeoutController.signal,
            connectTimeout: service.timeout || serviceTimeout,
          });
          const data = await response.json();
          if (timeoutId) clearTimeout(timeoutId);
          if (data && data.ip) {
            debugLog(`IP检测成功，使用服务: ${service.url}`);
            return service.mapping(data);
          } else {
            throw new Error(`无效的响应格式 from ${service.url}`);
          }
        } catch (error: any) {
          if (timeoutId) clearTimeout(timeoutId);
          lastError = error;
          console.warn(
            `尝试 ${attempt + 1}/${maxRetries} 失败 (${service.url}):`,
            error,
          );
          if (error.name === `AbortError`) {
            throw error;
          }
          if (attempt < maxRetries - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }
    }
    if (lastError) {
      throw new Error(`所有IP检测服务都失败: ${lastError.message}`);
    } else {
      throw new Error(`没有可用的IP检测服务`);
    }
  } finally {
    clearTimeout(overallTimeoutId);
  }
};
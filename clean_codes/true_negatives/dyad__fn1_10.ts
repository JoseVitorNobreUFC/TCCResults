// @ts-nocheck
export async function retryOnLocked<T>(
  operation: () => Promise<T>,
  context: string,
  {
    retryBranchWithChildError = false,
  }: { retryBranchWithChildError?: boolean } = {},
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const result = await operation();
      logger.info(`${context}: Success after ${attempt + 1} attempts`);
      return result;
    } catch (error: any) {
      lastError = error;
      if (!isLockedError(error)) {
        if (retryBranchWithChildError && error.response?.status === 422) {
          logger.info(
            `${context}: Branch with child error (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries + 1})`,
          );
        } else {
          throw error;
        }
      }
      if (attempt === RETRY_CONFIG.maxRetries) {
        logger.error(
          `${context}: Failed after ${RETRY_CONFIG.maxRetries + 1} attempts due to locked error`,
        );
        throw error;
      }
      const baseDelay = RETRY_CONFIG.baseDelay * Math.pow(2, attempt);
      const jitter = baseDelay * RETRY_CONFIG.jitterFactor * Math.random();
      const delay = Math.min(baseDelay + jitter, RETRY_CONFIG.maxDelay);

      logger.warn(
        `${context}: Locked error (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries + 1}), retrying in ${Math.round(delay)}ms`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}
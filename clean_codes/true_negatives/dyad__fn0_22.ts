// @ts-nocheck
export function useCountTokens() {
  const [result, setResult] = useAtom(tokenCountResultAtom);
  const [loading, setLoading] = useAtom(tokenCountLoadingAtom);
  const [error, setError] = useAtom(tokenCountErrorAtom);
  const countTokens = useCallback(
    async (chatId: number, input: string) => {
      setLoading(true);
      setError(null);
      try {
        const ipcClient = IpcClient.getInstance();
        const tokenResult = await ipcClient.countTokens({ chatId, input });
        setResult(tokenResult);
        return tokenResult;
      } catch (error) {
        console.error(`Error counting tokens:`, error);
        setError(error instanceof Error ? error : new Error(String(error)));
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setResult],
  );
  return {
    countTokens,
    result,
    loading,
    error,
  };
}
// @ts-nocheck
export function useLoadApp(appId: number | null) {
  const [, setApp] = useAtom(currentAppAtom);
  const {
    data: appData,
    isLoading: loading,
    error,
    refetch: refreshApp,
  } = useQuery<App | null, Error>({
    queryKey: [`app`, appId],
    queryFn: async () => {
      if (appId === null) {
        return null;
      }
      const ipcClient = IpcClient.getInstance();
      return ipcClient.getApp(appId);
    },
    enabled: appId !== null,
  });
  useEffect(() => {
    if (appId === null) {
      setApp(null);
    } else if (appData !== undefined) {
      setApp(appData);
    }
  }, [appId, appData, setApp]);
  return { app: appData, loading, error, refreshApp };
}
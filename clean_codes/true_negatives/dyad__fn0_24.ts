// @ts-nocheck
export function useCurrentBranch(appId: number | null) {
  const {
    data: branchInfo,
    isLoading,
    refetch: refetchBranchInfo,
  } = useQuery<BranchResult, Error>({
    queryKey: [`currentBranch`, appId],
    queryFn: async (): Promise<BranchResult> => {
      if (appId === null) {
        throw new Error(`appId is null, cannot fetch current branch.`);
      }
      const ipcClient = IpcClient.getInstance();
      return ipcClient.getCurrentBranch(appId);
    },
    enabled: appId !== null,
    meta: { showErrorToast: true },
  });

  return {
    branchInfo,
    isLoading,
    refetchBranchInfo,
  };
}
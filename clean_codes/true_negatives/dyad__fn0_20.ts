// @ts-nocheck
export function useCheckoutVersion() {
  const queryClient = useQueryClient();
  const setActiveCheckouts = useSetAtom(activeCheckoutCounterAtom);
  const { isPending: isCheckingOutVersion, mutateAsync: checkoutVersion } =
    useMutation<void, Error, CheckoutVersionVariables>({
      mutationFn: async ({ appId, versionId }) => {
        if (appId === null) {
          throw new Error(`App ID is null, cannot checkout version.`);
        }
        const ipcClient = IpcClient.getInstance();
        setActiveCheckouts((prev) => prev + 1);
        try {
          await ipcClient.checkoutVersion({ appId, versionId });
        } finally {
          setActiveCheckouts((prev) => prev - 1);
        }
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: [`currentBranch`, variables.appId],
        });
        queryClient.invalidateQueries({
          queryKey: [`versions`, variables.appId],
        });
      },
      meta: { showErrorToast: true },
    });

  return {
    checkoutVersion,
    isCheckingOutVersion,
  };
}
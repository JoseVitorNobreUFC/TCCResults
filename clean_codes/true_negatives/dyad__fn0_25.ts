// @ts-nocheck
export function useDeleteCustomModel({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, DeleteCustomModelParams>({
    mutationFn: async (params: DeleteCustomModelParams) => {
      if (!params.providerId || !params.modelApiName) {
        throw new Error(
          `Provider ID and Model API Name are required for deletion.`,
        );
      }
      const ipcClient = IpcClient.getInstance();
      await ipcClient.deleteCustomModel(params);
    },
    onSuccess: (data, params: DeleteCustomModelParams) => {
      queryClient.invalidateQueries({
        queryKey: [`language-models`, params.providerId],
      });
      queryClient.invalidateQueries({ queryKey: [`languageModels`] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error(`Error deleting custom model:`, error);
      onError?.(error);
    },
    meta: {
      showErrorToast: true,
    },
  });
  return mutation;
}
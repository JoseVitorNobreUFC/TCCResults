// @ts-nocheck
export const useUpdateProviderMutation = (appId: AppId) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (provider: Provider) => {
      await providersApi.update(provider, appId);
      return provider;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`providers`, appId] });
      toast.success(
        t(`notifications.updateSuccess`, {
          defaultValue: `供应商更新成功`,
        }),
      );
    },
    onError: (error: Error) => {
      toast.error(
        t(`notifications.updateFailed`, {
          defaultValue: `更新供应商失败: {{error}}`,
          error: error.message,
        }),
      );
    },
  });
};
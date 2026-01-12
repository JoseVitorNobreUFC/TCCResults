// @ts-nocheck
export const useAddProviderMutation = (appId: AppId) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (providerInput: Omit<Provider, `id`>) => {
      const newProvider: Provider = {
        ...providerInput,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      await providersApi.add(newProvider, appId);
      return newProvider;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`providers`, appId] });
      try {
        await providersApi.updateTrayMenu();
      } catch (trayError) {
        console.error(
          `Failed to update tray menu after adding provider`,
          trayError,
        );
      }

      toast.success(
        t(`notifications.providerAdded`, {
          defaultValue: `供应商已添加`,
        }),
      );
    },
    onError: (error: Error) => {
      toast.error(
        t(`notifications.addFailed`, {
          defaultValue: `添加供应商失败: {{error}}`,
          error: error.message,
        }),
      );
    },
  });
};
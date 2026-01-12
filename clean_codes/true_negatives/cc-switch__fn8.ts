// @ts-nocheck
export const useDeleteProviderMutation = (appId: AppId) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (providerId: string) => {
      await providersApi.delete(providerId, appId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`providers`, appId] });
      try {
        await providersApi.updateTrayMenu();
      } catch (trayError) {
        console.error(
          `Failed to update tray menu after deleting provider`,
          trayError,
        );
      }
      toast.success(
        t(`notifications.deleteSuccess`, {
          defaultValue: `供应商已删除`,
        }),
      );
    },
    onError: (error: Error) => {
      toast.error(
        t(`notifications.deleteFailed`, {
          defaultValue: `删除供应商失败: {{error}}`,
          error: error.message,
        }),
      );
    },
  });
};
// @ts-nocheck
export const useSwitchProviderMutation = (appId: AppId) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (providerId: string) => {
      return await providersApi.switch(providerId, appId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`providers`, appId] });
      try {
        await providersApi.updateTrayMenu();
      } catch (trayError) {
        console.error(
          `Failed to update tray menu after switching provider`,
          trayError,
        );
      }
      toast.success(
        t(`notifications.switchSuccess`, {
          defaultValue: `切换供应商成功`,
          appName: t(`apps.${appId}`, { defaultValue: appId }),
        }),
      );
    },
    onError: (error: Error) => {
      const detail = extractErrorMessage(error) || t(`common.unknown`);
      toast.error(
        t(`notifications.switchFailedTitle`, { defaultValue: `切换失败` }),
        {
          description: t(`notifications.switchFailed`, {
            defaultValue: `切换失败：{{error}}`,
            error: detail,
          }),
          duration: 6000,
          action: {
            label: t(`common.copy`, { defaultValue: `复制` }),
            onClick: () => {
              navigator.clipboard?.writeText(detail).catch(() => undefined);
            },
          },
        },
      );
    },
  });
};
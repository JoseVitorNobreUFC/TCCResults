// @ts-nocheck
async (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over || active.id === over.id) {
    return;
  }
  const oldIndex = sortedProviders.findIndex(
    (provider) => provider.id === active.id,
  );
  const newIndex = sortedProviders.findIndex(
    (provider) => provider.id === over.id,
  );
  if (oldIndex === -1 || newIndex === -1) {
    return;
  }
  const reordered = arrayMove(sortedProviders, oldIndex, newIndex);
  const updates = reordered.map((provider, index) => ({
    id: provider.id,
    sortIndex: index,
  }));
  try {
    await providersApi.updateSortOrder(updates, appId);
    await queryClient.invalidateQueries({
      queryKey: [`providers`, appId],
    });
    try {
      await providersApi.updateTrayMenu();
    } catch (trayError) {
      console.error(`Failed to update tray menu after sort`, trayError);
    }
    toast.success(
      t(`provider.sortUpdated`, {
        defaultValue: `排序已更新`,
      }),
    );
  } catch (error) {
    console.error(`Failed to update provider sort order`, error);
    toast.error(
      t(`provider.sortUpdateFailed`, {
        defaultValue: `排序更新失败`,
      }),
    );
  }
}
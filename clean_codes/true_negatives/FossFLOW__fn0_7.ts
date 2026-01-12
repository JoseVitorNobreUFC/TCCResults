// @ts-nocheck
export const useIconCategories = () => {
  const icons = useModelStore((state) => {
    return state.icons;
  });
  const iconCategoriesState = useUiStateStore((state) => {
    return state.iconCategoriesState;
  });
  const iconCategories = useMemo<IconCollectionStateWithIcons[]>(() => {
    return iconCategoriesState.map((collection) => {
      return {
        ...collection,
        icons: icons.filter((icon) => {
          return icon.collection === collection.id;
        })
      };
    });
  }, [icons, iconCategoriesState]);
  return {
    iconCategories
  };
};
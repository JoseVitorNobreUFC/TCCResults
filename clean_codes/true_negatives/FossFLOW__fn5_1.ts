// @ts-nocheck
export const deleteViewItem = (
  id: string,
  { state, viewId }: ViewReducerContext
): State => {
  const newState = produce(state, (draft) => {
    const view = getItemByIdOrThrow(draft.model.views, viewId);
    const viewItem = getItemByIdOrThrow(view.value.items, id);
    draft.model.views[view.index].items.splice(viewItem.index, 1);
    const connectorsToDelete = getConnectorsByViewItem(
      viewItem.value.id,
      view.value.connectors ?? []
    );
    if (connectorsToDelete.length > 0 && draft.model.views[view.index].connectors) {
      draft.model.views[view.index].connectors =
        draft.model.views[view.index].connectors?.filter(
          connector => !connectorsToDelete.some(c => c.id === connector.id)
        );
      connectorsToDelete.forEach(connector => {
        delete draft.scene.connectors[connector.id];
      });
    }
  });

  return newState;
};
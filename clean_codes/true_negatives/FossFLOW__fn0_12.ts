// @ts-nocheck
export const updateViewItem = (
  { id, ...updates }: { id: string } & Partial<ViewItem>,
  { viewId, state }: ViewReducerContext
): State => {
  const newState = produce(state, (draft) => {
    const view = getItemByIdOrThrow(draft.model.views, viewId);
    const { items } = view.value;
    if (!items) return;
    const viewItem = getItemByIdOrThrow(items, id);
    const newItem = { ...viewItem.value, ...updates };
    items[viewItem.index] = newItem;
    if (updates.tile) {
      const connectorsToUpdate = getConnectorsByViewItem(
        viewItem.value.id,
        view.value.connectors ?? []
      );
      const updatedConnectors = connectorsToUpdate.reduce((acc, connector) => {
        return reducers.view({
          action: 'UPDATE_CONNECTOR',
          payload: connector,
          ctx: { viewId, state: acc }
        });
      }, draft);
      draft.model.views[view.index].connectors =
        updatedConnectors.model.views[view.index].connectors;

      draft.scene.connectors = updatedConnectors.scene.connectors;
    }
  });
  const newView = getItemByIdOrThrow(newState.model.views, viewId);
  const issues = validateView(newView.value, { model: newState.model });
  if (issues.length > 0) {
    throw new Error(issues[0].message);
  }
  return newState;
};
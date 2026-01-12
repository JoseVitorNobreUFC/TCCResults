// @ts-nocheck
mousemove: ({ uiState, scene }) => {
  if (uiState.mode.type !== 'DRAG_ITEMS' || !uiState.mouse.mousedown) return;
  if (uiState.mode.isInitialMovement) {
    const delta = CoordsUtils.subtract(
      uiState.mouse.position.tile,
      uiState.mouse.mousedown.tile
    );
    dragItems(uiState.mode.items, uiState.mouse.position.tile, delta, scene);
    uiState.actions.setMode(
      produce(uiState.mode, (draft) => {
        draft.isInitialMovement = false;
      })
    );
    return;
  }
  if (!hasMovedTile(uiState.mouse) || !uiState.mouse.delta?.tile) return;
  const delta = uiState.mouse.delta.tile;
  dragItems(uiState.mode.items, uiState.mouse.position.tile, delta, scene);
}
// @ts-nocheck
mousedown: ({ uiState }) => {
  if (uiState.mode.type !== 'FREEHAND_LASSO') return;
  if (uiState.mode.selection) {
    const clickTile = uiState.mouse.position.tile;
    const isWithinSelection = isPointInPolygon(
      clickTile,
      uiState.mode.selection.pathTiles
    );
    if (isWithinSelection) {
      uiState.actions.setMode(
        produce(uiState.mode, (draft) => {
          if (draft.type === 'FREEHAND_LASSO') {
            draft.isDragging = true;
          }
        })
      );
      return;
    }
    uiState.actions.setMode(
      produce(uiState.mode, (draft) => {
        if (draft.type === 'FREEHAND_LASSO') {
          draft.path = [uiState.mouse.position.screen];
          draft.selection = null;
          draft.isDragging = false;
        }
      })
    );
    return;
  }
  uiState.actions.setMode(
    produce(uiState.mode, (draft) => {
      if (draft.type === 'FREEHAND_LASSO') {
        draft.path = [uiState.mouse.position.screen];
        draft.selection = null;
        draft.isDragging = false;
      }
    })
  );
}
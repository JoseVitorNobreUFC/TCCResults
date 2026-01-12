// @ts-nocheck
mouseup: ({ uiState, scene }) => {
  if (uiState.mode.type !== 'FREEHAND_LASSO') return;
  if (uiState.mode.path.length >= 3 && !uiState.mode.selection) {
    const rendererSize = uiState.rendererEl?.getBoundingClientRect();
    if (!rendererSize) return;
    const pathTiles = uiState.mode.path.map((screenPoint) => {
      return screenToIso({
        mouse: screenPoint,
        zoom: uiState.zoom,
        scroll: uiState.scroll,
        rendererSize: {
          width: rendererSize.width,
          height: rendererSize.height
        }
      });
    });
    const items = getItemsInFreehandBounds(pathTiles, scene);
    uiState.actions.setMode(
      produce(uiState.mode, (draft) => {
        if (draft.type === 'FREEHAND_LASSO') {
          draft.selection = {
            pathTiles,
            items
          };
          draft.isDragging = false;
        }
      })
    );
  } else {
    uiState.actions.setMode(
      produce(uiState.mode, (draft) => {
        if (draft.type === 'FREEHAND_LASSO') {
          draft.isDragging = false;
        }
      })
    );
  }
}
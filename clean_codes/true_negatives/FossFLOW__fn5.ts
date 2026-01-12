// @ts-nocheck
mousemove: ({ uiState, scene }) => {
  if (uiState.mode.type !== 'FREEHAND_LASSO' || !uiState.mouse.mousedown) return;
  if (uiState.mode.isDragging && uiState.mode.selection) {
    uiState.actions.setMode({
      type: 'DRAG_ITEMS',
      showCursor: true,
      items: uiState.mode.selection.items,
      isInitialMovement: true
    });
    return;
  }
  const newScreenPoint = uiState.mouse.position.screen;
  uiState.actions.setMode(
    produce(uiState.mode, (draft) => {
      if (draft.type === 'FREEHAND_LASSO') {
        const lastPoint = draft.path[draft.path.length - 1];
        if (!lastPoint ||
          Math.abs(newScreenPoint.x - lastPoint.x) > 5 ||
          Math.abs(newScreenPoint.y - lastPoint.y) > 5) {
          draft.path.push(newScreenPoint);
        }
      }
    })
  );
}
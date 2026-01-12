// @ts-nocheck
export const useDiagramUtils = () => {
  const scene = useScene();
  const rendererEl = useUiStateStore((state) => {
    return state.rendererEl;
  });
  const { size: rendererSize } = useResizeObserver(rendererEl);
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const getUnprojectedBounds = useCallback((): Size & Coords => {
    return getUnprojectedBoundsUtil(scene.currentView);
  }, [scene.currentView]);
  const getVisualBounds = useCallback((): Size & Coords => {
    return getVisualBoundsUtil(scene.currentView);
  }, [scene.currentView]);
  const getFitToViewParams = useCallback(
    (viewportSize: Size) => {
      return getFitToViewParamsUtil(scene.currentView, viewportSize);
    },
    [scene.currentView]
  );
  const fitToView = useCallback(async () => {
    const { zoom, scroll } = getFitToViewParams(rendererSize);
    uiStateActions.setScroll({
      position: scroll,
      offset: CoordsUtils.zero()
    });
    uiStateActions.setZoom(zoom);
  }, [uiStateActions, getFitToViewParams, rendererSize]);
  return {
    getUnprojectedBounds,
    getVisualBounds,
    fitToView,
    getFitToViewParams
  };
};
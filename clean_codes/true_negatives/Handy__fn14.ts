// @ts-nocheck
useEffect(() => {
  loadModels();
  loadCurrentModel();
  checkFirstRun();
  const progressUnlisten = listen<DownloadProgress>(
    `model-download-progress`,
    (event) => {
      setDownloadProgress(
        (prev) => new Map(prev.set(event.payload.model_id, event.payload)),
      );
    },
  );
  const completeUnlisten = listen<string>(
    `model-download-complete`,
    (event) => {
      const modelId = event.payload;
      setDownloadingModels((prev) => {
        const next = new Set(prev);
        next.delete(modelId);
        return next;
      });
      setDownloadProgress((prev) => {
        const next = new Map(prev);
        next.delete(modelId);
        return next;
      });
      loadModels();
    },
  );
  const extractionStartedUnlisten = listen<string>(
    `model-extraction-started`,
    (event) => {
      const modelId = event.payload;
      setExtractingModels((prev) => new Set(prev.add(modelId)));
    },
  );
  const extractionCompletedUnlisten = listen<string>(
    `model-extraction-completed`,
    (event) => {
      const modelId = event.payload;
      setExtractingModels((prev) => {
        const next = new Set(prev);
        next.delete(modelId);
        return next;
      });
      loadModels();
    },
  );
  const extractionFailedUnlisten = listen<{
    model_id: string;
    error: string;
  }>(`model-extraction-failed`, (event) => {
    const modelId = event.payload.model_id;
    setExtractingModels((prev) => {
      const next = new Set(prev);
      next.delete(modelId);
      return next;
    });
    setError(`Failed to extract model: ${event.payload.error}`);
  });
  return () => {
    progressUnlisten.then((fn) => fn());
    completeUnlisten.then((fn) => fn());
    extractionStartedUnlisten.then((fn) => fn());
    extractionCompletedUnlisten.then((fn) => fn());
    extractionFailedUnlisten.then((fn) => fn());
  };
}, []);
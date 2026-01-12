// @ts-nocheck
useEffect(() => {
  const screenshots = extractScreenshots(messages);
  setAllScreenshots(screenshots);
  if (screenshots.length > 0 && !currentScreenshot) {
    setTimeout(() => {
      const initialScreenshot = getScreenshotForScrollPosition(
        screenshots,
        messages,
        scrollContainerRef.current
      );
      if (initialScreenshot) {
        setCurrentScreenshot(initialScreenshot);
      } else {
        setCurrentScreenshot(screenshots[screenshots.length - 1]);
      }
    }, 100);
  } else if (screenshots.length === 0) {
    setCurrentScreenshot(null);
  } else if (screenshots.length > 0 && currentScreenshot) {
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const event = new Event('scroll');
        scrollContainerRef.current.dispatchEvent(event);
      }
    }, 300);
  }
}, [messages, scrollContainerRef]);
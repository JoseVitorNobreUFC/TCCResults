// @ts-nocheck
useEffect(() => {
  if (isPreview && previewValue !== undefined) {
    const value = previewValue
    if (value && typeof value === 'string') {
      if (isJira) {
        setSelectedIssueId(value)
      } else if (isDiscord) {
        setSelectedChannelId(value)
      } else if (isMicrosoftTeams) {
        setSelectedMessageId(value)
      } else if (isGoogleCalendar) {
        setSelectedCalendarId(value)
      } else if (isWealthbox) {
        setSelectedWealthboxItemId(value)
      } else {
        setSelectedFileId(value)
      }
    }
  } else {
    const value = getValue(blockId, subBlock.id)
    if (value && typeof value === 'string') {
      if (isJira) {
        setSelectedIssueId(value)
      } else if (isDiscord) {
        setSelectedChannelId(value)
      } else if (isMicrosoftTeams) {
        setSelectedMessageId(value)
      } else if (isGoogleCalendar) {
        setSelectedCalendarId(value)
      } else if (isWealthbox) {
        setSelectedWealthboxItemId(value)
      } else {
        setSelectedFileId(value)
      }
    }
  }
}, [isPreview, previewValue])
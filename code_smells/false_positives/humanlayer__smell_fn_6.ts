// @ts-nocheck
onSessionSettingsChanged: async (data: SessionSettingsChangedEventData) => {
  logger.log('useSessionSubscriptions.onSessionSettingsChanged', data)
  if (
    data.reason === SessionSettingsChangeReason.EXPIRED &&
    data.dangerously_skip_permissions === false
  ) {
    logger.debug('Server disabled expired dangerous skip permissions', {
      sessionId: data.session_id,
      expiredAt: data.expired_at,
    })
  }
  const updates: Record<string, any> = {}
  if (data.auto_accept_edits !== undefined) {
    updates.autoAcceptEdits = data.auto_accept_edits
  }
  if (data.dangerously_skip_permissions !== undefined) {
    updates.dangerouslySkipPermissions = data.dangerously_skip_permissions

    if (data.dangerously_skip_permissions && data.dangerously_skip_permissions_timeout_ms) {
      const expiresAt = new Date(Date.now() + data.dangerously_skip_permissions_timeout_ms)
      updates.dangerouslySkipPermissionsExpiresAt = expiresAt
    } else if (!data.dangerously_skip_permissions) {
      updates.dangerouslySkipPermissionsExpiresAt = undefined
    }
  }
  updateSession(data.session_id, updates)
  if (notificationService) {
    const title = data.dangerously_skip_permissions
      ? 'Bypassing permissions enabled'
      : data.auto_accept_edits
        ? 'Auto-accept edits enabled'
        : 'Auto-accept disabled'
    notificationService.notify({
      type: 'settings_changed',
      title,
      body: data.dangerously_skip_permissions
        ? 'ALL tools will be automatically approved'
        : data.auto_accept_edits
          ? 'Edit, Write, and MultiEdit tools will be automatically approved'
          : 'All tools require manual approval',
      metadata: { sessionId: data.session_id },
    })
  }
}
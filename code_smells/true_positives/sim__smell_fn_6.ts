// @ts-nocheck
params: (params) => {
  const {
    credential,
    authMethod,
    botToken,
    operation,
    channel,
    manualChannel,
    title,
    content,
    limit,
    oldest,
    ...rest
  } = params
  const effectiveChannel = (channel || manualChannel || '').trim()
  if (!effectiveChannel) {
    throw new Error(
      'Channel is required. Please select a channel or enter a channel ID manually.'
    )
  }
  const baseParams: Record<string, any> = {
    channel: effectiveChannel,
  }
  if (authMethod === 'bot_token') {
    if (!botToken) {
      throw new Error('Bot token is required when using bot token authentication')
    }
    baseParams.accessToken = botToken
  } else {
    if (!credential) {
      throw new Error('Slack account credential is required when using Sim Bot')
    }
    baseParams.credential = credential
  }
  switch (operation) {
    case 'send':
      if (!rest.text) {
        throw new Error('Message text is required for send operation')
      }
      baseParams.text = rest.text
      break
    case 'canvas':
      if (!title || !content) {
        throw new Error('Title and content are required for canvas operation')
      }
      baseParams.title = title
      baseParams.content = content
      break
    case 'read':
      if (limit) {
        const parsedLimit = Number.parseInt(limit, 10)
        baseParams.limit = !Number.isNaN(parsedLimit) ? parsedLimit : 10
      } else {
        baseParams.limit = 10
      }
      if (oldest) {
        baseParams.oldest = oldest
      }
      break
  }
  return baseParams
}
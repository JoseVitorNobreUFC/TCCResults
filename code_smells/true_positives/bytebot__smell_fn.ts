// @ts-nocheck
function formatMessagesForAnthropic(
  messages: Message[],
): Anthropic.MessageParam[] {
  const anthropicMessages: Anthropic.MessageParam[] = [];
  for (const [index, message] of messages.entries()) {
    const messageContentBlocks = message.content as MessageContentBlock[];
    const content: Anthropic.ContentBlockParam[] = [];
    if (
      messageContentBlocks.every((block) => isUserActionContentBlock(block))
    ) {
      const userActionContentBlocks = messageContentBlocks.flatMap(
        (block) => block.content,
      );
      for (const block of userActionContentBlocks) {
        if (isComputerToolUseContentBlock(block)) {
          content.push({
            type: 'text',
            text: `User performed action: ${block.name}\n${JSON.stringify(block.input, null, 2)}`,
          });
        } else {
          content.push(block as Anthropic.ContentBlockParam);
        }
      }
    } else {
      content.push(
        ...messageContentBlocks.map(
          (block) => block as Anthropic.ContentBlockParam,
        ),
      );
    }
    if (index === messages.length - 1) {
      content[content.length - 1]['cache_control'] = {
        type: 'ephemeral',
      };
    }
    anthropicMessages.push({
      role: message.role === Role.USER ? 'user' : 'assistant',
      content: content,
    });
  }
  return anthropicMessages;
}
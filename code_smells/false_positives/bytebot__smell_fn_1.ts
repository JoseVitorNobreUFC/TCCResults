// @ts-nocheck
export function getLabel(block: ComputerToolUseContentBlock) {
  if (isScreenshotToolUseBlock(block)) {
    return 'Screenshot';
  }

  if (isWaitToolUseBlock(block)) {
    return 'Wait';
  }

  if (isTypeKeysToolUseBlock(block)) {
    return 'Keys';
  }

  if (isTypeTextToolUseBlock(block)) {
    return 'Type';
  }

  if (isPasteTextToolUseBlock(block)) {
    return 'Paste';
  }

  if (isPressKeysToolUseBlock(block)) {
    return 'Press Keys';
  }

  if (isMoveMouseToolUseBlock(block)) {
    return 'Move Mouse';
  }

  if (isScrollToolUseBlock(block)) {
    return 'Scroll';
  }

  if (isCursorPositionToolUseBlock(block)) {
    return 'Cursor Position';
  }

  if (isClickMouseToolUseBlock(block)) {
    const button = block.input.button;
    if (button === 'left') {
      if (block.input.clickCount === 2) {
        return 'Double Click';
      }

      if (block.input.clickCount === 3) {
        return 'Triple Click';
      }

      return 'Click';
    }

    return `${block.input.button?.charAt(0).toUpperCase() + block.input.button?.slice(1)} Click`;
  }

  if (isDragMouseToolUseBlock(block)) {
    return 'Drag';
  }

  if (isPressMouseToolUseBlock(block)) {
    return 'Press Mouse';
  }

  if (isTraceMouseToolUseBlock(block)) {
    return 'Trace Mouse';
  }

  if (isApplicationToolUseBlock(block)) {
    return 'Open Application';
  }

  if (isReadFileToolUseBlock(block)) {
    return 'Read File';
  }

  return 'Unknown';
}
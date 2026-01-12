// @ts-nocheck
export function findExtents(indent: number, content: string): number {
  let blockIdx = 0;
  let mode: 'finding-newline' | 'finding-indention' = 'finding-newline';
  for (;;) {
    if (mode === 'finding-newline') {
      while (content[blockIdx++] !== '\n') {
        if (blockIdx >= content.length) {
          break;
        }
      }
      if (blockIdx >= content.length) {
        return content.length;
      }
      mode = 'finding-indention';
    } else {
      let thisIndent = 0;
      for (;;) {
        if ([' ', '\t'].includes(content[blockIdx])) {
          thisIndent += 1;
          blockIdx++;
          if (blockIdx >= content.length) {
            return content.length;
          }
          continue;
        }
        mode = 'finding-newline';
        blockIdx++;
        break;
      }
      if (thisIndent < indent) {
        if (content.slice(blockIdx - 1, blockIdx + 1) === '--') {
          mode = 'finding-newline';
          continue;
        }
        for (;;) {
          if (content[blockIdx--] === '\n') {
            break;
          }
        }
        return blockIdx + 1;
      }
      mode = 'finding-newline';
    }
  }
}
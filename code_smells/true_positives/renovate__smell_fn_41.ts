// @ts-nocheck
export function stripTemplates(content: string): string {
  const result: string[] = [];
  const len = content.length;
  let idx = 0;
  let lastPos = 0;
  while (idx < len) {
    if (content[idx] === '{' && idx + 1 < len) {
      let closing: string | undefined;
      let skipLength = 0;
      if (content[idx + 1] === '%') {
        if (idx + 2 < len && content[idx + 2] === '`') {
          closing = '`%}';
          skipLength = 3;
        } else {
          closing = '%}';
          skipLength = 2;
        }
      } else if (content[idx + 1] === '{') {
        if (idx + 2 < len && content[idx + 2] === '`') {
          closing = '`}}';
          skipLength = 3;
        } else {
          closing = '}}';
          skipLength = 2;
        }
      } else if (content[idx + 1] === '#') {
        closing = '#}';
        skipLength = 2;
      }
      if (closing) {
        const end = content.indexOf(closing, idx + skipLength);
        if (end !== -1) {
          if (idx > lastPos) {
            result.push(content.slice(lastPos, idx));
          }
          idx = end + closing.length;
          lastPos = idx;
          continue;
        }
      }
    }
    idx++;
  }
  if (lastPos < len) {
    result.push(content.slice(lastPos));
  }
  return result.join('');
}
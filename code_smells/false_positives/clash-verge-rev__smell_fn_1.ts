// @ts-nocheck
function parseNoticeExtras(extras: NoticeExtra[]): ParsedNoticeExtras {
  let params: Record<string, unknown> | undefined;
  let raw: unknown;
  let duration: number | undefined;
  for (const extra of extras) {
    if (extra === undefined) continue;
    if (typeof extra === 'number' && duration === undefined) {
      duration = extra;
      continue;
    }
    if (isPlainRecord(extra)) {
      if (!params) {
        params = extra;
        continue;
      }
      if (!raw) {
        raw = extra;
        continue;
      }
    }
    if (!raw) {
      raw = extra;
      continue;
    }
    if (!params && isPlainRecord(extra)) {
      params = extra;
      continue;
    }
    if (duration === undefined && typeof extra === 'number') {
      duration = extra;
    }
  }
  return { params, raw, duration };
}
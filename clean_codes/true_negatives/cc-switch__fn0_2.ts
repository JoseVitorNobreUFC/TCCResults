// @ts-nocheck
function mapUpdateHandle(raw: Update): UpdateHandle {
  return {
    version: (raw as any).version ?? ``,
    notes: (raw as any).notes,
    date: (raw as any).date,
    async downloadAndInstall(onProgress?: (e: UpdateProgressEvent) => void) {
      await (raw as any).downloadAndInstall((evt: any) => {
        if (!onProgress) return;
        const mapped: UpdateProgressEvent = {
          event: evt?.event,
        };
        if (evt?.event === `Started`) {
          mapped.total = evt?.data?.contentLength ?? 0;
          mapped.downloaded = 0;
        } else if (evt?.event === `Progress`) {
          mapped.downloaded = evt?.data?.chunkLength ?? 0;
        }
        onProgress(mapped);
      });
    },
    download: (raw as any).download
      ? async () => {
          await (raw as any).download();
        }
      : undefined,
    install: (raw as any).install
      ? async () => {
          await (raw as any).install();
        }
      : undefined,
  };
}
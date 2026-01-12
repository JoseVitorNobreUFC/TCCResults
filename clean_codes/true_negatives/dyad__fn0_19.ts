// @ts-nocheck
export function registerUploadHandlers() {
  handle(`upload-to-signed-url`, async (_, params: UploadToSignedUrlParams) => {
    const { url, contentType, data } = params;
    logger.debug(`IPC: upload-to-signed-url called`);
    if (!url || typeof url !== `string` || !url.startsWith(`https://`)) {
      throw new Error(`Invalid signed URL provided`);
    }
    if (!contentType || typeof contentType !== `string`) {
      throw new Error(`Invalid content type provided`);
    }
    const response = await fetch(url, {
      method: `PUT`,
      headers: {
        'Content-Type': contentType,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(
        `Upload failed with status ${response.status}: ${response.statusText}`,
      );
    }
    logger.debug(`Successfully uploaded data to signed URL`);
  });
  logger.debug(`Registered upload IPC handlers`);
}
// @ts-nocheck
export async function startProxy(
  targetOrigin: string,
  opts: {
    onStarted?: (proxyUrl: string) => void;
  } = {},
) {
  if (!/^https?:\/\//.test(targetOrigin))
    throw new Error(`startProxy: targetOrigin must be absolute http/https URL`);
  const port = await findAvailablePort(50_000, 60_000);
  logger.info(`Found available port`, port);
  const {
    onStarted,
  } = opts;
  const worker = new Worker(
    path.resolve(__dirname, `..`, `..`, `worker`, `proxy_server.js`),
    {
      workerData: {
        targetOrigin,
        port,
      },
    },
  );
  worker.on(`message`, (m) => {
    logger.info(`[proxy]`, m);
    if (typeof m === `string` && m.startsWith(`proxy-server-start url=`)) {
      const url = m.substring(`proxy-server-start url=`.length);
      onStarted?.(url);
    }
  });
  worker.on(`error`, (e) => logger.error(`[proxy] error:`, e));
  worker.on(`exit`, (c) => logger.info(`[proxy] exit`, c));
  return worker;
}
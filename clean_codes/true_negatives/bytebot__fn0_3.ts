// @ts-nocheck
async function proxy(req: NextRequest, path: string[]): Promise<Response> {
  const BASE_URL = process.env.BYTEBOT_AGENT_BASE_URL!;
  const subPath = path.length ? path.join(`/`) : ``;
  const url = `${BASE_URL}/${subPath}${req.nextUrl.search}`;
  const cookies = req.headers.get(`cookie`);
  const init: RequestInit = {
    method: req.method,
    headers: {
      'Content-Type': `application/json`,
      ...(cookies && { Cookie: cookies }),
    },
    body:
      req.method === `GET` || req.method === `HEAD`
        ? undefined
        : await req.text(),
  };
  const res = await fetch(url, init);
  const body = await res.text();
  const setCookieHeaders = res.headers.getSetCookie?.() || [];
  const responseHeaders = new Headers({
    'Content-Type': `application/json`,
  });
  setCookieHeaders.forEach((cookie) => {
    responseHeaders.append(`Set-Cookie`, cookie);
  });
  return new Response(body, {
    status: res.status,
    headers: responseHeaders,
  });
}
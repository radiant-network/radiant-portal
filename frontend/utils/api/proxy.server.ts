import axios, { AxiosError, HttpStatusCode } from 'axios';
import * as process from 'node:process';

import { ensureFreshAccessToken } from '../auth/server';

const JSON_CONTENT_TYPE = 'application/json';

function transformUrl(url: string): string {
  const parsedUrl = new URL(url);

  // Extract the path after `/api/`
  const match = parsedUrl.pathname.match(/^\/api\/(.*)$/);

  if (match) {
    return `${process.env.API_HOST}/${match[1]}${parsedUrl.search}`;
  }

  // Return original URL if it doesn't match the expected pattern
  return url;
}

// Mirrors axios' default parsing: JSON when it parses, the raw text otherwise.
function parseBody(data: ArrayBuffer): unknown {
  const text = Buffer.from(data).toString('utf-8');
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function isFile(contentType: string): boolean {
  return contentType !== '' && !contentType.includes(JSON_CONTENT_TYPE) && !contentType.startsWith('text/');
}

function cookieHeaders(cookies: string[]): Headers {
  const headers = new Headers();
  cookies.forEach(cookie => headers.append('Set-Cookie', cookie));
  return headers;
}

export const proxyApi = async (request: Request) => {
  let session;
  try {
    session = await ensureFreshAccessToken(request);
  } catch {
    return new Response(JSON.stringify({ detail: 'session read failed' }), {
      status: HttpStatusCode.InternalServerError,
      headers: { 'Content-Type': JSON_CONTENT_TYPE },
    });
  }
  if (!session) {
    return new Response(JSON.stringify({ detail: 'unauthorized' }), {
      status: HttpStatusCode.Unauthorized,
      headers: { 'Content-Type': JSON_CONTENT_TYPE },
    });
  }
  const { accessToken, cookies } = session;

  try {
    const transformedUrl = transformUrl(request.url);

    let data;
    if (request.method.toLowerCase() !== 'get') {
      const text = await request.text();
      data = text ? JSON.parse(text) : undefined;
    }

    const response = await axios({
      method: request.method,
      url: transformedUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': JSON_CONTENT_TYPE,
      },
      data,
      responseType: 'arraybuffer',
    });

    const contentType = String(response.headers['content-type'] ?? '');
    const headers = cookieHeaders(cookies);
    if (isFile(contentType)) {
      headers.set('Content-Type', contentType);
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) headers.set('Content-Disposition', String(contentDisposition));
      return new Response(new Uint8Array(response.data), { status: 200, headers });
    }

    headers.set('Content-Type', JSON_CONTENT_TYPE);
    return new Response(JSON.stringify(parseBody(response.data)), { status: 200, headers });
  } catch (error: any) {
    const headers = cookieHeaders(cookies);
    headers.set('Content-Type', JSON_CONTENT_TYPE);
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      return new Response(JSON.stringify(errorData ? parseBody(errorData) : errorData), {
        status: error.response?.status || HttpStatusCode.InternalServerError,
        headers,
      });
    } else {
      return new Response(JSON.stringify(error), {
        status: HttpStatusCode.InternalServerError,
        headers,
      });
    }
  }
};

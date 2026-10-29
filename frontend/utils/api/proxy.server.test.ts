import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('../auth/server', () => ({
  getSessionAccessToken: async () => 'token',
}));

import { proxyApi } from './proxy.server';

const XLSX_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
// Starts like a real xlsx (zip "PK" magic) and holds a byte that is not valid UTF-8.
const XLSX_BYTES = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0xff, 0x00, 0x10]);

// Stand-in for the API: answers per path.
let api: Server;

beforeAll(async () => {
  api = createServer((req, res) => {
    if (req.url === '/cases/1') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"case_id":1}');
    } else if (req.url === '/report') {
      res.writeHead(200, {
        'Content-Type': XLSX_CONTENT_TYPE,
        'Content-Disposition': 'attachment; filename=MRN1_1_20261027.xlsx',
      });
      res.end(XLSX_BYTES);
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end('{"message":"bad request"}');
    }
  });
  await new Promise<void>(resolve => api.listen(0, '127.0.0.1', resolve));
  process.env.API_HOST = `http://127.0.0.1:${(api.address() as AddressInfo).port}`;
});

afterAll(() => new Promise<void>(resolve => api.close(() => resolve())));

const portal = (path: string) => new Request(`http://localhost:3000${path}`);

describe('api proxy', () => {
  it('relays a JSON response as JSON', async () => {
    const response = await proxyApi(portal('/api/cases/1'));

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(await response.json()).toEqual({ case_id: 1 });
  });

  it('relays a file byte for byte with its type and file name', async () => {
    const response = await proxyApi(portal('/api/report'));

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe(XLSX_CONTENT_TYPE);
    expect(response.headers.get('Content-Disposition')).toBe('attachment; filename=MRN1_1_20261027.xlsx');
    expect(Buffer.from(await response.arrayBuffer())).toEqual(XLSX_BYTES);
  });

  it('keeps the status and JSON body of an error', async () => {
    const response = await proxyApi(portal('/api/unknown'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ message: 'bad request' });
  });
});

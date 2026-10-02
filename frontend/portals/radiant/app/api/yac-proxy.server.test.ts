import { createServer, type IncomingHttpHeaders, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const session = vi.hoisted(() => ({ token: 'session-token' as string | undefined }));
vi.mock('~/utils/auth.server', () => ({
  getSessionAccessToken: async () => session.token,
}));

import { proxyYac, transformUrl } from './yac-proxy.server';

type Received = { method?: string; url?: string; headers: IncomingHttpHeaders; body: Buffer };

// Stand-in for the YAC agent: records what it received and answers per path.
let received: Received;
let agent: Server;

beforeAll(async () => {
  agent = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      received = { method: req.method, url: req.url, headers: req.headers, body: Buffer.concat(chunks) };
      if (req.url?.startsWith('/v1/yac/metadata')) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ detail: 'database refused' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json', 'X-Usage-Total-Tokens': '42' });
        res.end('[{"name":"RenderVisualization"}]');
      }
    });
  });
  await new Promise<void>(resolve => agent.listen(0, '127.0.0.1', resolve));
  process.env.YAC_AGENT_HOST = `http://127.0.0.1:${(agent.address() as AddressInfo).port}`;
});

afterAll(() => new Promise<void>(resolve => agent.close(() => resolve())));

beforeEach(() => {
  session.token = 'session-token';
});

const portal = (path: string, init?: RequestInit) => new Request(`http://localhost:3000${path}`, init);

describe('yac proxy', () => {
  it('maps /api/yac/* onto the agent host, keeping the query string', () => {
    expect(transformUrl('http://localhost:3000/api/yac/v1/yac/metadata?package=tenant_a')).toBe(
      `${process.env.YAC_AGENT_HOST}/v1/yac/metadata?package=tenant_a`,
    );
  });

  it('sends the session token and the agent headers, never the browser Authorization', async () => {
    await proxyYac(
      portal('/api/yac/v1/yac/completions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer forged',
          'Content-Type': 'application/json',
          'X-Conversation-Id': 'conv-1',
          'X-OpenAI-Key': 'sk-user',
          Cookie: 'session=abc',
        },
        body: '{}',
      }),
    );
    expect(received.headers.authorization).toBe('Bearer session-token');
    expect(received.headers['x-conversation-id']).toBe('conv-1');
    expect(received.headers['x-openai-key']).toBe('sk-user');
    expect(received.headers.cookie).toBeUndefined();
  });

  it('relays the body byte for byte instead of re-serializing it', async () => {
    const body = '{"messages": [],  "dataSchema": "{\\"a\\": 1}"}';
    await proxyYac(
      portal('/api/yac/v1/yac/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }),
    );
    expect(received.method).toBe('POST');
    expect(received.body.toString()).toBe(body);
  });

  it('relays the agent response, status and X-Usage-* headers', async () => {
    const res = await proxyYac(portal('/api/yac/v1/yac/completions', { method: 'POST', body: '{}' }));
    expect(res.status).toBe(200);
    expect(res.headers.get('x-usage-total-tokens')).toBe('42');
    expect(await res.text()).toBe('[{"name":"RenderVisualization"}]');
  });

  it('relays agent errors as-is', async () => {
    const res = await proxyYac(portal('/api/yac/v1/yac/metadata?package=tenant_a'));
    expect(received.url).toBe('/v1/yac/metadata?package=tenant_a');
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ detail: 'database refused' });
  });

  it('answers 401 without calling the agent when there is no session token', async () => {
    session.token = undefined;
    received = { headers: {}, body: Buffer.alloc(0) };
    const res = await proxyYac(portal('/api/yac/v1/yac/metadata?package=tenant_a'));
    expect(res.status).toBe(401);
    expect(received.url).toBeUndefined();
  });

  it('answers 502 when the agent is unreachable', async () => {
    const host = process.env.YAC_AGENT_HOST;
    process.env.YAC_AGENT_HOST = 'http://127.0.0.1:1';
    try {
      const res = await proxyYac(portal('/api/yac/v1/yac/metadata'));
      expect(res.status).toBe(502);
    } finally {
      process.env.YAC_AGENT_HOST = host;
    }
  });
});

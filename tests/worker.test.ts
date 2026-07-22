import { describe, expect, it, vi } from 'vitest';
import worker, { buildContentSecurityPolicy } from '../src/worker';

const createEnv = () => {
  const assets = {
    fetch: vi.fn(async () => new Response('asset response')),
    connect: vi.fn(() => {
      throw new Error('Static assets do not use socket connections.');
    }),
  } satisfies Fetcher;

  return { assets, env: { ASSETS: assets } satisfies Env };
};

describe('production worker', () => {
  it('builds a nonce-based AdSense-compatible content security policy', () => {
    const policy = buildContentSecurityPolicy('testnonce');

    expect(policy).toContain("script-src 'nonce-testnonce' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("frame-ancestors 'none'");
  });

  it('permanently redirects HTTP requests to the same HTTPS URL', async () => {
    const { assets, env } = createEnv();
    const response = await worker.fetch(new Request('http://home.utilitas.app/guides/?topic=paint'), env);

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://home.utilitas.app/guides/?topic=paint');
    expect(assets.fetch).not.toHaveBeenCalled();
  });

  it('serves HTTPS requests through the static-assets binding', async () => {
    const { assets, env } = createEnv();
    const request = new Request('https://home.utilitas.app/robots.txt');
    const response = await worker.fetch(request, env);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('asset response');
    expect(assets.fetch).toHaveBeenCalledOnce();
    expect(assets.fetch).toHaveBeenCalledWith(request);
  });
});

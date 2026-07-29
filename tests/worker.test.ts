import { describe, expect, it, vi } from 'vitest';
import worker, { buildContentSecurityPolicy } from '../src/worker';
import { acceptsMarkdown, htmlToMarkdown } from '../src/agent-discovery';

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

describe('agent discovery responses', () => {
  const homepage = `<!doctype html>
    <html>
      <head>
        <title>Quantity &amp; Test</title>
        <meta name="description" content="A planning test page.">
        <script>throw new Error("must not be included")</script>
      </head>
      <body><main><h1>Calculator</h1><p>Read the <a href="/access/">access guide</a>.</p></main></body>
    </html>`;

  it('negotiates Markdown media ranges and converts useful structure', () => {
    expect(acceptsMarkdown('text/markdown')).toBe(true);
    expect(acceptsMarkdown('text/html, text/markdown; q=0.8')).toBe(true);
    expect(acceptsMarkdown('text/markdown;q=0')).toBe(false);
    expect(acceptsMarkdown('text/html')).toBe(false);

    const markdown = htmlToMarkdown(homepage);
    expect(markdown).toMatch(/^# Quantity & Test$/m);
    expect(markdown).toMatch(/^> A planning test page\.$/m);
    expect(markdown).toMatch(/^# Calculator$/m);
    expect(markdown).toContain('[access guide](/access/)');
    expect(markdown).not.toContain('must not be included');
  });

  it('returns homepage Markdown with discovery, policy, token, and cache headers', async () => {
    const assets = {
      fetch: vi.fn(async () =>
        new Response(homepage, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            ETag: '"homepage"',
          },
        }),
      ),
      connect: vi.fn(() => {
        throw new Error('Static assets do not use socket connections.');
      }),
    } satisfies Fetcher;
    const response = await worker.fetch(
      new Request('https://home.utilitas.app/', { headers: { Accept: 'text/markdown' } }),
      { ASSETS: assets } satisfies Env,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(response.headers.get('Vary')).toBe('Accept');
    expect(response.headers.get('ETag')).toBeNull();
    expect(response.headers.get('Link')).toContain('rel="service-doc"');
    expect(response.headers.get('Link')).toContain('/.well-known/agent-skills/index.json');
    expect(response.headers.get('Content-Signal')).toBe(
      'ai-train=no, search=yes, ai-input=yes',
    );
    expect(response.headers.get('x-markdown-tokens')).toMatch(/^\d+$/);
    expect(await response.text()).toMatch(/^# Quantity & Test$/m);
  });
});

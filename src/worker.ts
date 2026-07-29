import {
  CONTENT_SIGNAL,
  HOMEPAGE_DISCOVERY_LINKS,
  acceptsMarkdown,
  appendVary,
  createMarkdownResponse,
} from './agent-discovery';

export const buildContentSecurityPolicy = (nonce: string) => [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self' https:",
  "font-src 'self' data: https:",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'frame-src https:',
  "img-src 'self' data: blob: https:",
  "manifest-src 'self'",
  "object-src 'none'",
  `script-src 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:`,
  "style-src 'self' 'unsafe-inline' https:",
  "worker-src 'self' blob:",
].join('; ');

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 308);
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set('Content-Signal', CONTENT_SIGNAL);
    if (url.pathname === '/' || url.pathname === '/index.html') {
      headers.set('Link', HOMEPAGE_DISCOVERY_LINKS);
    }
    if (url.pathname === '/.well-known/security.txt') {
      headers.set('Content-Type', 'text/plain; charset=utf-8');
    }
    if (url.pathname.endsWith('.md')) {
      headers.set('Content-Type', 'text/markdown; charset=utf-8');
    }

    if (!headers.get('Content-Type')?.startsWith('text/html')) {
      return new Response(request.method === 'HEAD' ? null : response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    headers.delete('Content-Length');
    headers.delete('ETag');
    appendVary(headers, 'Accept');
    if (acceptsMarkdown(request.headers.get('Accept') || '')) {
      return createMarkdownResponse(response, headers, await response.text(), request.method);
    }

    const nonce = crypto.randomUUID().replaceAll('-', '');
    headers.set('Content-Security-Policy', buildContentSecurityPolicy(nonce));

    const htmlResponse = new Response(request.method === 'HEAD' ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    if (request.method === 'HEAD') return htmlResponse;

    return new HTMLRewriter()
      .on('script', {
        element(element) {
          element.setAttribute('nonce', nonce);
        },
      })
      .transform(htmlResponse);
  },
} satisfies ExportedHandler<Env>;

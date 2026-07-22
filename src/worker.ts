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
    if (!response.headers.get('Content-Type')?.startsWith('text/html')) return response;

    const nonce = crypto.randomUUID().replaceAll('-', '');
    const headers = new Headers(response.headers);
    headers.delete('Content-Length');
    headers.delete('ETag');
    headers.set('Content-Security-Policy', buildContentSecurityPolicy(nonce));

    const htmlResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    return new HTMLRewriter()
      .on('script', {
        element(element) {
          element.setAttribute('nonce', nonce);
        },
      })
      .transform(htmlResponse);
  },
} satisfies ExportedHandler<Env>;

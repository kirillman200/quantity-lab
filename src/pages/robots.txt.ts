import { SITE } from '../data/site';
export function GET() {
  return new Response(
    `User-agent: *\nContent-Signal: ai-train=no, search=yes, ai-input=yes\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}

import { SITE } from '../data/site';
export function GET() { return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }); }

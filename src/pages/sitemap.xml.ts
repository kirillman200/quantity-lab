import { publicRoutes, SITE } from '../data/site';

export function GET() {
  const urls = publicRoutes.map((route) => `  <url><loc>${new URL(route.path, SITE.origin)}</loc><lastmod>${SITE.updated}</lastmod></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

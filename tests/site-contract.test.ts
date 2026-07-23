import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { publicRoutes, SITE } from '../src/data/site';

const dist = join(process.cwd(), 'dist');
const routeFile = (path: string) => path === '/' ? join(dist, 'index.html') : join(dist, path.replace(/^\//, ''), 'index.html');
const extract = (html: string, pattern: RegExp) => html.match(pattern)?.[1]?.trim() ?? '';

describe('built public contract', () => {
  it('pins the release to the production origin and private deployment boundary', () => {
    expect(SITE.origin).toBe('https://home.utilitas.app');
    const wrangler = JSON.parse(readFileSync(join(process.cwd(), 'wrangler.jsonc'), 'utf8'));
    expect(wrangler.workers_dev).toBe(false);
    expect(wrangler.preview_urls).toBe(false);
    expect(wrangler.routes).toEqual([{ pattern: 'home.utilitas.app', custom_domain: true }]);
    expect(wrangler.main).toBe('./src/worker.ts');
    expect(wrangler.assets.directory).toBe('./dist');
    expect(wrangler.assets.binding).toBe('ASSETS');
    expect(wrangler.assets.run_worker_first).toBe(true);
  });

  it('builds every canonical public route with metadata and one h1', () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const route of publicRoutes) {
      const file = routeFile(route.path);
      expect(existsSync(file), `${route.path} should exist`).toBe(true);
      const html = readFileSync(file, 'utf8');
      const title = extract(html, /<title>([^<]+)<\/title>/i);
      const description = extract(html, /<meta name="description" content="([^"]+)"/i);
      const canonical = extract(html, /<link rel="canonical" href="([^"]+)"/i);
      expect(title.length).toBeGreaterThan(15);
      expect(description.length).toBeGreaterThan(50);
      expect(canonical).toBe(new URL(route.path, SITE.origin).toString());
      expect((html.match(/<h1(?:\s[^>]*)?>/gi) ?? []).length).toBe(1);
      expect(html).toContain('property="og:image"');
      expect(html).toContain('application/ld+json');
      expect(html).toContain('<link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16 32x32 48x48">');
      expect(html).toContain('<link rel="icon" href="/favicon.svg" type="image/svg+xml">');
      expect(html).toContain('<meta name="google-adsense-account" content="ca-pub-7469113252837951">');
      expect(html).toContain('src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7469113252837951"');
      expect(titles.has(title), `duplicate title: ${title}`).toBe(false);
      expect(descriptions.has(description), `duplicate description: ${description}`).toBe(false);
      titles.add(title); descriptions.add(description);
    }
  });

  it('keeps sitemap, robots, and llms inventory synchronized', () => {
    const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(urls).toEqual(publicRoutes.map((route) => new URL(route.path, SITE.origin).toString()));
    expect(readFileSync(join(dist, 'robots.txt'), 'utf8')).toContain(`${SITE.origin}/sitemap.xml`);
    const llms = readFileSync(join(dist, 'llms.txt'), 'utf8');
    for (const route of publicRoutes.filter((route) => route.path !== '/')) expect(llms).toContain(new URL(route.path, SITE.origin).toString());
    expect(llms).toContain('No registration, credentials, server API, OAuth, MCP, A2A, or remote-agent endpoint exists.');
  });

  it('publishes security files and excludes private artifacts and source maps', () => {
    expect(existsSync(join(dist, '_headers'))).toBe(true);
    expect(existsSync(join(dist, '.assetsignore'))).toBe(true);
    const headers = readFileSync(join(dist, '_headers'), 'utf8');
    for (const header of ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options', 'X-Frame-Options', 'Permissions-Policy']) expect(headers).toContain(header);
    const securityTxt = readFileSync(join(dist, '.well-known', 'security.txt'), 'utf8');
    expect(securityTxt).toContain('Contact: https://github.com/kirillman200/quantity-lab/security/advisories/new');
    expect(securityTxt).toContain('Canonical: https://home.utilitas.app/.well-known/security.txt');
    expect(securityTxt).toContain('Policy: https://home.utilitas.app/security/');
    expect(securityTxt).toContain('Preferred-Languages: en');
    const expires = securityTxt.match(/^Expires:\s*(.+)$/m)?.[1].trim();
    expect(expires).toBeTruthy();
    expect(Date.parse(expires!)).toBeGreaterThan(Date.now());
    expect(Date.parse(expires!)).toBeLessThanOrEqual(Date.now() + 366 * 24 * 60 * 60 * 1000);
    expect(headers).toContain('/.well-known/security.txt');
    expect(headers).toContain('Cache-Control: public, max-age=86400');
    const securityPolicy = readFileSync(routeFile('/security/'), 'utf8');
    expect(securityPolicy).toContain('href="https://github.com/kirillman200/quantity-lab/security/advisories/new"');
    expect(securityPolicy).toContain('Last reviewed:</strong> July 23, 2026');
    for (const path of ['package.json', 'package-lock.json', 'wrangler.jsonc', 'README.md', 'SECURITY.md', '.git', 'tests', 'src']) expect(existsSync(join(dist, path)), `${path} must not deploy`).toBe(false);
    const walk = (directory: string): string[] => readdirSync(directory).flatMap((name: string) => { const path = join(directory, name); return statSync(path).isDirectory() ? walk(path) : [path]; });
    expect(walk(dist).some((file) => file.endsWith('.map'))).toBe(false);
  });

  it('builds a noindex offline page and custom 404', () => {
    expect(readFileSync(join(dist, 'offline', 'index.html'), 'utf8')).toContain('content="noindex, follow"');
    expect(readFileSync(join(dist, '404.html'), 'utf8')).toContain('content="noindex, follow"');
  });

  it('publishes the authorized AdSense seller and accurate advertising disclosures', () => {
    expect(readFileSync(join(dist, 'ads.txt'), 'utf8').trim()).toBe('google.com, pub-7469113252837951, DIRECT, f08c47fec0942fa0');
    const privacy = readFileSync(routeFile('/privacy/'), 'utf8');
    expect(privacy).toContain('Google AdSense');
    expect(privacy).toContain('Google-certified consent management platform');
    const headers = readFileSync(join(dist, '_headers'), 'utf8');
    expect(headers).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:");
  });

  it('publishes SVG and conventional favicon assets', () => {
    expect(readFileSync(join(dist, 'favicon.svg'), 'utf8')).toContain('<svg');
    const ico = readFileSync(join(dist, 'favicon.ico'));
    expect(ico.subarray(0, 4)).toEqual(Buffer.from([0, 0, 1, 0]));
    expect(ico.readUInt16LE(4)).toBe(3);
  });

  it('uses only the standard reserved ad-space label', () => {
    const routes = ['/', '/calculators/', '/calculators/paint/', '/guides/', '/guides/paint-coverage/'];
    for (const route of routes) {
      const html = readFileSync(routeFile(route), 'utf8');
      const slots = [...html.matchAll(/<div class="[^"]*ad-slot[^"]*"[^>]*>([\s\S]*?)<\/div>/g)];
      expect(slots.length, `${route} should include reserved ad space`).toBeGreaterThan(0);
      for (const slot of slots) {
        expect(slot[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).toBe('Reserved ad space');
        expect((slot[1].match(/<span(?:\s[^>]*)?>/g) ?? []).length).toBe(1);
      }
    }
  });
});

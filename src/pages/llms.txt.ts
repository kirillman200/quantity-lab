import { calculators, guides, SITE, trustRoutes } from '../data/site';

export function GET() {
  const line = (path: string, title: string, description: string) => `- [${title}](${new URL(path, SITE.origin)}): ${description}`;
  const content = [
    `# ${SITE.name}`,
    '',
    '> Free, product-neutral browser calculators for home project materials, costs, and printable shopping lists. No account or protected API exists. Project inputs stay in the browser unless the user creates a URL containing them.',
    '',
    '## Calculators',
    '',
    ...calculators.map((item) => line(`/calculators/${item.slug}/`, item.name, item.description)),
    '',
    '## Guides',
    '',
    ...guides.map((item) => line(`/guides/${item.slug}/`, item.title, item.description)),
    '',
    '## Site information',
    '',
    ...trustRoutes.map((item) => line(item.path, item.title, item.description)),
    line('/sitemap.xml', 'Sitemap', 'Canonical public URL inventory.'),
    '',
    '## Access and limitations',
    '',
    '- No registration, credentials, server API, OAuth, MCP, A2A, or remote-agent endpoint exists.',
    '- Calculator actions change browser-local state. Share links expose the encoded project inputs to anyone who receives the URL.',
    '- Results are planning estimates and must be checked against product labels, site conditions, professional guidance, and local requirements.',
    '',
  ].join('\n');
  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

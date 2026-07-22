# Project Quantity Lab site contract

- Production origin: `https://home.utilitas.app`.
- Hosting contract: A minimal Worker enforces HTTPS, then Cloudflare Workers Static Assets serves only `dist/` through the custom domain. The `workers.dev` route and preview URLs are disabled.
- Product promise: Help homeowners calculate material quantities, costs, and a practical shopping list without an account.
- Public routes: Defined once in `src/data/site.ts`; navigation, sitemap, `llms.txt`, and regression tests consume that inventory.
- Private surface: Source, dependencies, tests, environment files, Git metadata, build tooling, and local logs. Only `dist/` is deployed.
- Data boundary: Project inputs stay in the browser in URL parameters or localStorage. The app has no account, database, or standalone analytics. Public pages load Google AdSense, and shared URL parameters may be included in third-party requests.
- Advertising contract: The public publisher ID is `ca-pub-7469113252837951`; `/ads.txt` authorizes Google as a direct seller. The Worker adds a per-response nonce to scripts and an AdSense-compatible strict CSP. Regional consent is configured through AdSense Privacy & messaging or another Google-certified CMP, not through repository secrets.
- Untrusted inputs: Names, dimensions, prices, and shared URL state. Inputs are length- and range-bounded and rendered by Vue text interpolation.
- Real capabilities: Five browser calculators, local saves, shareable links, print/PDF layouts, metric/imperial input, and offline reuse after a successful load.
- Unsupported capabilities: Server API, accounts, cloud sync, OAuth, MCP, A2A, checkout, purchasing, professional engineering, or code-compliance approval.
- Owner: Repository owner maintains content, security, privacy, and calculation assumptions.

All results are planning estimates. Users must confirm product coverage, site conditions, installation instructions, and local requirements before purchasing or building.

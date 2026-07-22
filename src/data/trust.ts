export interface TrustPage {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
}

export const trustPages: TrustPage[] = [
  {
    slug: 'about', title: 'About Project Quantity Lab', eyebrow: 'Independent project planning',
    description: 'Why this free, independent home project planning site exists and how its estimates are designed.',
    intro: 'Project Quantity Lab helps homeowners move from rough dimensions to a checkable purchasing plan. It is independent of material brands and retailers, so the calculator can use the coverage, package sizes, and prices that are actually available to you.',
    sections: [
      { heading: 'A project planner, not a one-field answer', paragraphs: ['Real work involves more than length × width. Each tool combines multiple rooms, beds, pours, or runs; shows exact and rounded quantities; preserves assumptions; and builds a practical shopping list.'] },
      { heading: 'How trust is built', paragraphs: ['Calculation formulas live in typed, tested code. The result shows what was included, what was removed, and where waste was applied. Worked examples provide another way to audit the logic.'], bullets: ['Product-neutral inputs', 'Visible formulas and assumptions', 'Automated unit and browser tests', 'Planning warnings on every result'] },
      { heading: 'What the site does not do', paragraphs: ['The site does not provide structural, electrical, gas, engineering, surveying, legal, or code-compliance advice. It does not sell products, operate accounts, or send project inputs to a server.'] },
    ],
  },
  {
    slug: 'contact', title: 'Contact Project Quantity Lab', eyebrow: 'Corrections are welcome',
    description: 'Send calculator feedback, correction details, accessibility notes, or security reports.',
    intro: 'Clear reports make the calculators better. When reporting a calculation concern, include the calculator, unit system, inputs, expected result, actual result, and the product coverage or yield you used.',
    sections: [
      { heading: 'General and calculation feedback', paragraphs: ['A public feedback channel is not configured yet. Until one is published here, do not send private project documents or sensitive personal information to anyone claiming to represent Project Quantity Lab.'] },
      { heading: 'Security reports', paragraphs: ['A public security-reporting channel is not configured yet. This page will be updated before reports are accepted; never include credentials, private project details, or personal information in an unsolicited report.'] },
      { heading: 'Accessibility feedback', paragraphs: ['Describe the page, device, browser, assistive technology, and the task you could not complete. A screenshot is helpful when it does not contain private information.'] },
    ],
  },
  {
    slug: 'privacy', title: 'Privacy', eyebrow: 'Your project can stay yours',
    description: 'How Project Quantity Lab handles local project data, share links, hosting logs, advertising, and consent.',
    intro: 'Project Quantity Lab does not require an account. Calculator inputs are processed in your browser. Public pages include Google AdSense code to verify the publisher account and support advertising.',
    sections: [
      { heading: 'Local saves', paragraphs: ['When you choose Save, the project is written to localStorage in the current browser. It is not uploaded to Project Quantity Lab. You can remove an individual save in the planner or clear all saved projects from the footer.'] },
      { heading: 'Share links', paragraphs: ['When you choose Share, a compact copy of the project inputs is placed in the URL query string. Anyone who receives that URL can read the encoded project details. Do not put confidential names, addresses, or notes in a share link.'] },
      { heading: 'Hosting logs', paragraphs: ['Cloudflare may process ordinary request information needed to deliver and protect the site, such as IP address, user agent, requested URL, timestamps, and security signals, under its applicable terms and policies. Calculator inputs are not sent as request bodies, but shared URL parameters are part of the requested URL.'] },
      { heading: 'Google AdSense', paragraphs: ['The site loads Google AdSense code using publisher ID ca-pub-7469113252837951. Google and its advertising partners may process device, browser, IP address, page, cookie or local-storage, consent, and ad-interaction data under their applicable policies. Shared URL parameters are part of the page address and may be included in third-party requests, so share links must not contain confidential information.'] },
      { heading: 'Consent and advertising choices', paragraphs: ['Where required, advertising storage and personalization must be controlled through Google Privacy & messaging or another Google-certified consent management platform. The site owner is responsible for keeping that account-level configuration active for applicable regions. Browser privacy controls or content blockers may prevent advertising code from loading.'] },
      { heading: 'Analytics', paragraphs: ['The site does not include a standalone analytics product at this time. AdSense can still provide advertising measurement and reporting as part of its service. Reserved ad-space labels remain layout placeholders unless Google Auto ads or a configured ad unit fills a placement.'] },
    ],
  },
  {
    slug: 'terms', title: 'Terms and estimate disclaimer', eyebrow: 'Planning estimates only',
    description: 'Planning-estimate limitations, acceptable use, and user responsibilities.',
    intro: 'By using Project Quantity Lab, you agree to use its results as preliminary planning estimates and to verify product data, site conditions, installation instructions, and local requirements.',
    sections: [
      { heading: 'No professional advice', paragraphs: ['The calculators do not provide engineering, architectural, structural, surveying, legal, safety, or building-code advice. Do not use them to determine structural loads, electrical or gas work, load-bearing assemblies, or other safety-critical designs.'] },
      { heading: 'Your inputs and product data', paragraphs: ['You are responsible for accurate measurements, unit selection, package yields, coverage, prices, waste allowances, and interpreting the result for the actual product and project.'] },
      { heading: 'No warranty', paragraphs: ['The site is provided as available without warranties of accuracy, fitness, merchantability, availability, or non-infringement to the extent permitted by law. Verify quantities before purchasing and keep retailer return rules in mind.'] },
      { heading: 'Acceptable use', paragraphs: ['Do not attempt to disrupt the site, bypass security controls, misrepresent its results as professional certification, or use it unlawfully.'] },
    ],
  },
  {
    slug: 'security', title: 'Security', eyebrow: 'Small public surface',
    description: 'Security design, reporting channel, deployment boundary, and supported product surface.',
    intro: 'The production deployment is an allowlisted static build. Source files, tests, dependencies, Git metadata, environment files, and local deployment state are outside the public asset directory.',
    sections: [
      { heading: 'Browser-only architecture', paragraphs: ['There is no application server, database, authentication system, file upload, or protected API. Vue renders user labels as text, inputs are length- and range-bounded, and shared state has a strict size and shape limit.'] },
      { heading: 'Response protections', paragraphs: ['Production responses use a Content Security Policy, clickjacking protection, MIME-sniffing protection, a restrictive permissions policy, same-origin resource policy, and a privacy-preserving referrer policy.'] },
      { heading: 'Report a vulnerability', paragraphs: ['A public security-reporting channel is not configured yet. Do not test in a way that degrades availability or accesses data that is not yours. This page will be updated when a dedicated reporting channel is available.'] },
    ],
  },
  {
    slug: 'access', title: 'Access for people and agents', eyebrow: 'Anonymous browser access',
    description: 'Anonymous access, browser-local state, and the absence of accounts or a protected API.',
    intro: 'Every public page can be read without registration. The calculator interface requires a browser with JavaScript; instructional guides and formulas are statically rendered.',
    sections: [
      { heading: 'No credentials', paragraphs: ['There is no registration or provisioning endpoint, no token to request, and no protected HTTP API. Agents and users should never send credentials to Project Quantity Lab.'] },
      { heading: 'Browser-local actions', paragraphs: ['Calculating changes only in-memory state. Save writes to this browser’s localStorage. Share creates a URL containing bounded project state. Print invokes the browser’s print dialog. None of these actions create a cloud account.'] },
      { heading: 'Machine-readable map', paragraphs: ['The root llms.txt file provides a concise map of calculators, guides, and trust pages. It is informational and is not an access-control or ranking mechanism.'] },
      { heading: 'No invented protocols', paragraphs: ['The site does not advertise OAuth, MCP, A2A, a remote agent, or a server API because those services do not exist.'] },
    ],
  },
];

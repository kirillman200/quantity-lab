export const SITE = {
  name: 'Project Quantity Lab',
  origin: 'https://home.utilitas.app',
  description: 'Free, product-neutral calculators for home project materials, costs, and printable shopping lists.',
  updated: '2026-07-22',
} as const;

export type CalculatorSlug = 'paint' | 'flooring-tile' | 'landscape-materials' | 'concrete' | 'fence';

export interface CalculatorDefinition {
  slug: CalculatorSlug;
  name: string;
  shortName: string;
  description: string;
  eyebrow: string;
  accent: string;
  icon: string;
  features: string[];
  formula: string;
  assumptions: string[];
  example: { input: string; result: string };
  packages: string[];
  faq: Array<{ question: string; answer: string }>;
  guides: string[];
}

export const calculators: CalculatorDefinition[] = [
  {
    slug: 'paint',
    name: 'Paint & primer calculator',
    shortName: 'Paint',
    description: 'Plan paint and primer for multiple rooms, openings, ceilings, coats, coverage, waste, and price.',
    eyebrow: 'Walls, ceilings & openings',
    accent: '#f06d3a',
    icon: 'paint',
    features: ['Multiple rooms', 'Doors and windows', 'Primer and coats', 'Ceiling option'],
    formula: 'Net paint area = wall perimeter × height + selected ceilings − doors − windows. Paint volume = net area × coats ÷ stated coverage, then the waste allowance is applied before rounding to whole containers.',
    assumptions: ['Every room is rectangular.', 'All walls in a room use the same height.', 'Coverage is entered per gallon or litre and should match the product label.', 'Doors and windows are treated as unpainted openings.'],
    example: { input: 'A 12 × 10 × 8 ft room, one 21 sq ft door, two 15 sq ft windows, two coats, 400 sq ft/gal coverage and 10% waste.', result: 'Net walls are 301 sq ft. Two coats with waste require 1.66 gal, so the shopping quantity is 2 one-gallon cans.' },
    packages: ['1 qt / 0.95 L sample or trim cans', '1 US gal / 3.78 L standard cans', '5 US gal / 18.9 L pails'],
    faq: [
      { question: 'Should I include the ceiling?', answer: 'Only enable the ceiling for rooms where it will receive the selected paint. Its area is length × width.' },
      { question: 'Why does the calculator round up?', answer: 'Paint is bought in discrete containers. The exact volume is shown, but the shopping quantity rounds up to avoid a shortfall.' },
      { question: 'Does primer use the same coverage?', answer: 'Not always. Enter the primer coverage printed on its label; porous or patched surfaces may use more.' },
    ],
    guides: ['measure-room-for-paint', 'paint-coverage', 'paint-coats', 'subtract-doors-windows', 'painting-shopping-checklist'],
  },
  {
    slug: 'flooring-tile',
    name: 'Flooring & tile calculator',
    shortName: 'Flooring & tile',
    description: 'Combine rectangular, circular, and triangular areas, then estimate pieces, boxes, waste, and cost.',
    eyebrow: 'Rooms, tile & pattern waste',
    accent: '#1b7f79',
    icon: 'tile',
    features: ['Three area shapes', 'Tile or plank size', 'Pattern allowance', 'Boxes and pieces'],
    formula: 'Project area is the sum of each shape. Purchase area = project area × (1 + waste). Pieces = purchase area ÷ piece area; boxes = purchase area ÷ package coverage. Both are rounded up.',
    assumptions: ['Circular inputs use diameter.', 'Package coverage is the usable coverage printed on the box.', 'Pattern allowance and waste should include cuts, defects, and future repairs.', 'Transitions, underlayment, mortar, and grout are listed separately.'],
    example: { input: 'A 12 × 14 ft room, 8 × 48 in planks, 20 sq ft per box, straight layout and 10% waste.', result: 'The purchase target is 184.8 sq ft: about 70 planks and 10 boxes.' },
    packages: ['Tile sold by piece or carton', 'Plank flooring sold by carton', 'Sheet goods sold by linear length'],
    faq: [
      { question: 'How much waste should I use?', answer: 'A simple square room often uses 8–10%. Diagonal or complex layouts commonly need 12–15% or more.' },
      { question: 'Can I mix room shapes?', answer: 'Yes. Add rectangles, circles, or triangles and the planner combines their areas before waste.' },
      { question: 'Should closets be separate?', answer: 'Separate areas make measurements easier to audit, but one combined area produces the same total.' },
    ],
    guides: ['measure-irregular-floor', 'flooring-waste-allowance'],
  },
  {
    slug: 'landscape-materials',
    name: 'Mulch, soil & gravel calculator',
    shortName: 'Mulch, soil & gravel',
    description: 'Estimate volume across multiple beds and compare bagged material with bulk delivery pricing.',
    eyebrow: 'Beds, depth, bags & bulk',
    accent: '#66833f',
    icon: 'landscape',
    features: ['Multiple beds', 'Rectangles and circles', 'Bags versus bulk', 'Compaction allowance'],
    formula: 'Volume = area × depth. Each bed is converted to cubic feet or cubic metres, then waste/settling is applied. Bags and bulk quantities are rounded up to purchasable units.',
    assumptions: ['Depth is the installed depth before long-term settling.', 'Bag volume is the nominal label volume.', 'Bulk delivery minimums and weight limits are not included.', 'Gravel density varies, so tonnes are an optional planning conversion only.'],
    example: { input: 'A 20 × 6 ft bed at 3 in depth with 10% contingency and 2 cu ft bags.', result: 'The plan needs 33 cu ft, or 17 bags. That is about 1.23 cubic yards before supplier minimums.' },
    packages: ['1–2 cu ft mulch or soil bags', '25–50 L metric bags', 'Bulk cubic-yard or cubic-metre delivery'],
    faq: [
      { question: 'How deep should mulch be?', answer: 'Two to four inches is common, but plant type, existing material, and drainage matter. Avoid piling mulch against trunks or foundations.' },
      { question: 'Why compare bags with bulk?', answer: 'The lowest sticker price is not always cheapest per installed volume. Delivery charges and minimums can change the result.' },
      { question: 'Can volume convert exactly to tonnes?', answer: 'No. Weight depends on material, moisture, and gradation. Use the supplier’s density for a reliable estimate.' },
    ],
    guides: ['landscape-depth-and-volume', 'bags-versus-bulk'],
  },
  {
    slug: 'concrete',
    name: 'Concrete volume & bag calculator',
    shortName: 'Concrete',
    description: 'Combine slabs, footings, post holes, and steps, then compare bag yields and ready-mix volume.',
    eyebrow: 'Slabs, footings, posts & steps',
    accent: '#59636e',
    icon: 'concrete',
    features: ['Four pour shapes', 'Multiple sections', 'Bag-yield comparison', 'Ready-mix volume'],
    formula: 'Rectangular volume = length × width × depth. Cylindrical post-hole volume = π × radius² × depth. Step volume = tread × rise × width × count. Total volume receives the selected contingency before bag yields are compared.',
    assumptions: ['Dimensions describe the finished concrete volume.', 'Post-hole calculation does not subtract the post volume, providing a conservative estimate.', 'Bag yield must come from the manufacturer label.', 'Large pours may be more practical as ready-mix delivery.'],
    example: { input: 'A 10 × 8 ft slab, 4 in thick, with 10% contingency.', result: 'The purchase volume is about 29.3 cu ft or 1.09 cu yd, requiring roughly 49 bags at 0.60 cu ft yield.' },
    packages: ['20–25 kg small bags', '30 kg / 60 lb medium bags', '36–40 kg / 80 lb large bags', 'Ready-mix by cubic yard or metre'],
    faq: [
      { question: 'Should I subtract the post?', answer: 'This planner intentionally does not. That small conservative margin helps cover irregular holes and spillage.' },
      { question: 'What contingency is reasonable?', answer: 'Five to ten percent is common for measured forms; irregular excavation may need more.' },
      { question: 'Is this a structural design tool?', answer: 'No. It estimates volume only. Footing size, reinforcement, mix strength, frost depth, and permits require local professional guidance.' },
    ],
    guides: ['concrete-volume-and-bag-yield', 'when-to-order-ready-mix'],
  },
  {
    slug: 'fence',
    name: 'Fence material calculator',
    shortName: 'Fence',
    description: 'Plan runs, gates, post spacing, panels, rails, pickets, concrete, and an editable shopping list.',
    eyebrow: 'Runs, posts, panels & gates',
    accent: '#94652d',
    icon: 'fence',
    features: ['Multiple runs', 'Gate deductions', 'Posts and panels', 'Rails and pickets'],
    formula: 'Net fence length = run length − gate widths. Sections = ceiling(net length ÷ target spacing). Each independent run needs sections + 1 posts. Rails and panels follow the section count; pickets follow net length ÷ picket pitch.',
    assumptions: ['Each entered run is independent and receives two end posts.', 'Gate posts and gate hardware are added separately.', 'Panel width or spacing is a planning target; field layout may shift.', 'Corner, terminal, brace, and code requirements vary by fence system.'],
    example: { input: 'A 60 ft run with a 4 ft gate and 8 ft spacing, two rails per section.', result: 'The net run is 56 ft: 7 sections, 8 line/end posts, 2 gate posts, and 14 rails.' },
    packages: ['Prefabricated panels', 'Loose rails and pickets', 'Posts with concrete per hole', 'Gate hardware kits'],
    faq: [
      { question: 'Why are gate posts separate?', answer: 'Gates usually need stronger terminal posts and dedicated hardware, so the shopping list keeps them visible.' },
      { question: 'Does the tool place corners?', answer: 'Treat each straight run as independent. Add a new run at every corner so its end posts are counted.' },
      { question: 'Does this check bylaws?', answer: 'No. Confirm height, setbacks, utility locates, permits, and pool-barrier rules locally.' },
    ],
    guides: ['measure-fence-runs', 'fence-post-spacing'],
  },
];

export interface GuideDefinition {
  slug: string;
  title: string;
  description: string;
  category: CalculatorSlug;
  readingTime: string;
  intro: string;
  sections: Array<{ heading: string; paragraphs: string[]; steps?: string[] }>;
  takeaway: string;
}

export const guides: GuideDefinition[] = [
  {
    slug: 'measure-room-for-paint', title: 'How to measure a room for paint', category: 'paint', readingTime: '6 min',
    description: 'Measure wall perimeter, height, ceilings, doors, and windows for a paint estimate you can audit.',
    intro: 'A reliable paint plan begins with a small set of measurements written down room by room. Measuring the perimeter is faster and less error-prone than treating every wall as a separate project.',
    sections: [
      { heading: 'Measure the room shell', paragraphs: ['Measure the length and width at floor level, then measure wall height from finished floor to ceiling. Older rooms can vary, so use the tallest height when you want a conservative estimate.'], steps: ['Sketch the room and label length and width.', 'Measure the wall height.', 'Record any half walls, alcoves, or sections with a different height separately.'] },
      { heading: 'Record openings', paragraphs: ['Measure each door and window as width × height. Subtract only openings that will not be painted. A closet door, built-in cabinet, or large fireplace can be treated the same way.'], steps: ['Count repeated opening sizes.', 'Keep trim separate if it uses another product.', 'Do not subtract tiny outlets or switch plates; their area is negligible.'] },
      { heading: 'Audit the result', paragraphs: ['The four-wall area for a rectangular room is 2 × (length + width) × height. Add length × width for a painted ceiling, then subtract openings. Compare that result with your notes before selecting coats and coverage.'] },
    ], takeaway: 'Keep one line per room. A room-by-room plan is easier to revise, save, share, and shop from than one unexplained total.'
  },
  {
    slug: 'paint-coverage', title: 'How much paint does a gallon cover?', category: 'paint', readingTime: '5 min',
    description: 'Understand label coverage, surface porosity, colour changes, and why exact paint volume differs from cans to buy.',
    intro: 'A common planning value is around 350–400 square feet per US gallon, but the product label is the source that matters. Coverage is affected by the coating, surface, roller nap, application method, and substrate.',
    sections: [
      { heading: 'Coverage is per coat', paragraphs: ['If a wall needs two coats, its area consumes coverage twice. A 400 sq ft wall with 400 sq ft/gal coverage needs about two gallons for two coats before waste—not one.'] },
      { heading: 'Porous surfaces use more', paragraphs: ['Fresh drywall, masonry, repaired areas, and rough texture can absorb more coating. Primer can reduce uneven absorption, but its own coverage also varies.'] },
      { heading: 'Exact volume versus shopping quantity', paragraphs: ['The formula produces a continuous volume, while stores sell discrete cans. Keep both numbers: exact volume explains the math; rounded containers form the shopping list.'] },
    ], takeaway: 'Enter the actual label coverage and keep a modest contingency. Product-specific data beats a universal rule of thumb.'
  },
  {
    slug: 'paint-coats', title: 'Do I need one coat or two?', category: 'paint', readingTime: '5 min',
    description: 'Choose a realistic coat count based on colour change, surface condition, sheen, and product instructions.',
    intro: '“One-coat coverage” is a product claim under specific conditions, not a promise for every room. The safer plan considers the old colour, new colour, surface repairs, sheen, and the finish quality you expect.',
    sections: [
      { heading: 'When one coat may work', paragraphs: ['One coat can be reasonable for a close colour match on a sound, previously painted surface using a high-quality product. Touch-ups must blend and the substrate should be uniform.'] },
      { heading: 'When two coats are prudent', paragraphs: ['Large colour changes, dark-to-light transitions, patched walls, porous surfaces, strong lighting, and higher-sheen finishes often reveal thin or uneven coverage.'] },
      { heading: 'Use primer for a purpose', paragraphs: ['Primer is most valuable for bare or repaired substrate, stains, adhesion problems, or difficult colour transitions. It is not automatically required on every previously painted wall.'] },
    ], takeaway: 'Plan two finish coats when uncertainty is costly. If one coat succeeds, the unopened extra can may be returnable—check store policy before buying.'
  },
  {
    slug: 'subtract-doors-windows', title: 'How to subtract doors and windows', category: 'paint', readingTime: '4 min',
    description: 'Decide which openings are worth subtracting and keep trim calculations separate.',
    intro: 'Subtracting openings improves a paint estimate, but false precision can waste more time than material. Measure large openings; ignore tiny interruptions.',
    sections: [
      { heading: 'Use width × height', paragraphs: ['A typical door measuring 3 × 7 ft removes 21 sq ft from the wall area. A 3 × 5 ft window removes 15 sq ft. Multiply by the number of identical openings.'] },
      { heading: 'Keep casing and trim separate', paragraphs: ['The opening area does not include the casing or jamb if those are being painted. Trim is usually estimated by linear length and may use a different paint and sheen.'] },
      { heading: 'Stay conservative', paragraphs: ['Do not subtract outlets, vents, or small fixtures. Their combined area is small and the retained allowance helps with roller and tray losses.'] },
    ], takeaway: 'Subtract meaningful unpainted surfaces, then let the waste allowance cover small interruptions and application losses.'
  },
  {
    slug: 'painting-shopping-checklist', title: 'Interior painting shopping checklist', category: 'paint', readingTime: '7 min',
    description: 'Build a practical paint-day list covering preparation, protection, application, cleanup, and safety.',
    intro: 'Paint quantity is only one part of the project. A checklist prevents the most common extra trip: discovering after preparation that a small tool or protective item is missing.',
    sections: [
      { heading: 'Preparation and protection', paragraphs: ['Surface preparation often determines finish quality more than the roller.'], steps: ['Patch compound and flexible putty knife', 'Sandpaper or sanding sponge', 'Cleaner and lint-free cloths', 'Drop cloths and painter’s tape', 'Caulk where appropriate'] },
      { heading: 'Application', paragraphs: ['Match applicators to the coating and surface.'], steps: ['Roller frame, sleeves, tray, and liners', 'Angled cut-in brush', 'Extension pole', 'Primer and finish paint', 'Stir sticks and pour spout'] },
      { heading: 'Cleanup and safety', paragraphs: ['Follow product ventilation, disposal, and personal-protection instructions.'], steps: ['Gloves and eye protection', 'Ventilation plan', 'Rags and waste bags', 'Container labels for touch-up paint', 'Local disposal instructions'] },
    ], takeaway: 'Print the calculator result and review the checklist before leaving. Product quantities and project supplies belong on the same plan.'
  },
  {
    slug: 'measure-irregular-floor', title: 'How to measure an irregular floor', category: 'flooring-tile', readingTime: '6 min',
    description: 'Break an L-shaped or curved floor into auditable rectangles, triangles, and circles.',
    intro: 'Irregular rooms become manageable when divided into simple non-overlapping shapes. The goal is not a perfect drawing—it is a set of dimensions that reconstructs the floor area without gaps or double-counting.',
    sections: [
      { heading: 'Divide, label, and measure', paragraphs: ['Draw the room, split it at inside corners, and label each shape. Rectangles cover most spaces; triangles handle angled sections; circles approximate round features.'], steps: ['Mark a baseline and every inside corner.', 'Create the fewest non-overlapping shapes.', 'Measure each shape and write units on the sketch.'] },
      { heading: 'Add fixed features intentionally', paragraphs: ['Flooring normally continues under some appliances but not under permanent islands or cabinets. Decide based on the installation plan and document exclusions as separate shapes.'] },
      { heading: 'Check with a bounding rectangle', paragraphs: ['Your summed area should not exceed the smallest rectangle that encloses the room unless you intentionally included closets or adjoining spaces. This quick check catches duplicated zones.'] },
    ], takeaway: 'A labeled sketch makes the estimate explainable to installers and easy to update when one measurement changes.'
  },
  {
    slug: 'flooring-waste-allowance', title: 'Choosing a flooring waste allowance', category: 'flooring-tile', readingTime: '5 min',
    description: 'Set waste for straight, staggered, diagonal, and pattern layouts without hiding the assumptions.',
    intro: 'Waste is not simply discarded material. It covers cuts, selection, defects, layout alignment, breakage, and a small reserve for future repairs.',
    sections: [
      { heading: 'Start with layout complexity', paragraphs: ['Simple rectangular rooms with straight installation may fit within 8–10%. Diagonal layouts, herringbone, many obstacles, or small-format tile often need 12–20%.'] },
      { heading: 'Respect package rounding', paragraphs: ['A calculated 10% allowance can become a larger effective allowance when the final box rounds up. Review the exact purchase area and whole-box result together.'] },
      { heading: 'Keep attic stock', paragraphs: ['A few matching pieces are valuable because colour lots and product lines change. Store them flat, dry, and labeled with the room and product information.'] },
    ], takeaway: 'Choose waste from the layout and room—not a fixed habit—and preserve the assumption with the saved project.'
  },
  {
    slug: 'landscape-depth-and-volume', title: 'Landscape depth and volume explained', category: 'landscape-materials', readingTime: '6 min',
    description: 'Convert bed area and installed depth into bags, cubic yards, or cubic metres.',
    intro: 'Landscape material is sold by volume, while beds are measured by area. Depth connects the two and must use the same unit system before multiplication.',
    sections: [
      { heading: 'Convert depth before multiplying', paragraphs: ['Three inches is 0.25 feet; 75 mm is 0.075 metres. Multiply area by that converted depth to get cubic volume.'] },
      { heading: 'Account for settling and grade', paragraphs: ['Loose soil and mulch settle, while excavated beds may have uneven grade. Add a documented contingency rather than quietly changing measurements.'] },
      { heading: 'Volume is not weight', paragraphs: ['A cubic yard of dry mulch and a cubic yard of wet gravel have very different weights. Use supplier density and vehicle payload limits before hauling.'] },
    ], takeaway: 'Measure area, choose installed depth, apply a visible contingency, and only then compare package or delivery sizes.'
  },
  {
    slug: 'bags-versus-bulk', title: 'Bags versus bulk landscape delivery', category: 'landscape-materials', readingTime: '5 min',
    description: 'Compare usable volume and total delivered cost instead of package sticker prices.',
    intro: 'Bulk material often has a lower unit price, but delivery minimums, access, cleanup, and leftover material can reverse the decision for a small project.',
    sections: [
      { heading: 'Compare the same volume', paragraphs: ['Convert bags and bulk quotes into cost per cubic foot, yard, litre, or metre. Include delivery fees, deposits, and minimum quantities.'] },
      { heading: 'Consider handling', paragraphs: ['Bags are easier to stage in tight spaces and keep clean. Bulk piles reduce packaging but need a drop location and many wheelbarrow trips.'] },
      { heading: 'Check product equivalence', paragraphs: ['“Garden soil,” “triple mix,” and gravel descriptions are not standardized. Compare composition and gradation as well as volume.'] },
    ], takeaway: 'The cheapest option is the lowest total cost for the right material in a quantity you can receive and move.'
  },
  {
    slug: 'concrete-volume-and-bag-yield', title: 'Concrete volume and bag yield', category: 'concrete', readingTime: '7 min',
    description: 'Translate form dimensions into concrete volume and compare bag sizes using label yield.',
    intro: 'Concrete bag weight does not directly tell you finished volume. Water ratio, mix design, and manufacturer determine yield, so compare products using the cured-volume yield printed on each bag.',
    sections: [
      { heading: 'Calculate finished shape volume', paragraphs: ['Convert every dimension to feet or metres first. Multiply length × width × depth for slabs and footings. Use π × radius² × depth for round holes.'] },
      { heading: 'Use yield, not bag weight', paragraphs: ['Divide purchase volume by the bag’s stated yield and round up. Entering local prices lets the planner compare total bag cost rather than assuming the largest bag is cheapest.'] },
      { heading: 'Protect the pour plan', paragraphs: ['Form leakage, uneven subgrade, spillage, and batching losses justify a contingency. Confirm reinforcement, joints, strength, weather, and curing separately.'] },
    ], takeaway: 'Volume planning is arithmetic; structural adequacy is not. Use the calculator for purchasing and qualified local guidance for design.'
  },
  {
    slug: 'when-to-order-ready-mix', title: 'When to order ready-mix concrete', category: 'concrete', readingTime: '6 min',
    description: 'Compare bag mixing with ready-mix based on volume, placement time, access, and total effort.',
    intro: 'The break-even point is not only material cost. A larger pour must be mixed, placed, consolidated, and finished before it loses workability.',
    sections: [
      { heading: 'Count batches and handling', paragraphs: ['Divide total volume by mixer capacity and estimate the time for every batch. Include moving bags, water measurement, and moving wet concrete to the forms.'] },
      { heading: 'Check delivery constraints', paragraphs: ['Ready-mix quotes may include minimum load, short-load, waiting, environmental, or pump charges. Confirm truck access, washout, crew size, and placement window.'] },
      { heading: 'Choose consistency', paragraphs: ['Ready-mix can provide consistent batching across the pour. Bag mixing can suit small, staged, or remote work where truck access is impossible.'] },
    ], takeaway: 'Ask suppliers for a delivered quote and logistics requirements, then compare it with the number of bag batches—not just bag price.'
  },
  {
    slug: 'measure-fence-runs', title: 'How to measure fence runs and gates', category: 'fence', readingTime: '6 min',
    description: 'Turn a property sketch into straight runs, corners, gates, and auditable material quantities.',
    intro: 'A fence estimate begins with straight runs between corners or terminals. Treating every change in direction as a new run keeps the post count and layout understandable.',
    sections: [
      { heading: 'Map before measuring', paragraphs: ['Sketch boundaries, buildings, slopes, utilities, trees, and gate locations. Confirm the property line through appropriate records or a survey rather than assuming an existing fence is correct.'] },
      { heading: 'Measure each straight run', paragraphs: ['Record horizontal distance. On steep slopes, installation method affects panel and post requirements, so note grade changes instead of relying on slope distance alone.'] },
      { heading: 'Separate gate openings', paragraphs: ['Deduct gate widths from ordinary panels and add gate posts and hardware separately. Gate clearance and hinge/latch geometry depend on the chosen system.'] },
    ], takeaway: 'The saved run list should match a labeled site sketch. That pairing is far more useful than a single perimeter number.'
  },
  {
    slug: 'fence-post-spacing', title: 'Fence post spacing explained', category: 'fence', readingTime: '5 min',
    description: 'Understand target spacing, equalized sections, panel widths, and why field layout can change the count.',
    intro: 'Post spacing is a maximum or product-driven target, not permission to leave a short remainder at the end. Good layout divides each run into practical, visually consistent sections.',
    sections: [
      { heading: 'Round section count up', paragraphs: ['If a 25 ft run targets 8 ft spacing, it needs four sections, not three. Equalized spacing would be 6.25 ft per section before accounting for post widths.'] },
      { heading: 'Panels impose module sizes', paragraphs: ['Prefabricated panels limit adjustment. Post centre spacing must match panel and bracket geometry, while custom rails can be cut to equalized spans.'] },
      { heading: 'Corners and gates change loads', paragraphs: ['Terminal, corner, and gate posts may need different sizes, depths, bracing, or concrete. Wind exposure and local frost conditions matter.'] },
    ], takeaway: 'Use the calculator count as a shopping baseline, then lay out actual post centres from the selected fence system and local requirements.'
  },
];

export const trustRoutes = [
  { path: '/about/', title: 'About Project Quantity Lab', description: 'Why this free, independent home project planning site exists and how its estimates are designed.' },
  { path: '/contact/', title: 'Contact Project Quantity Lab', description: 'Send calculator feedback, correction details, accessibility notes, or security reports.' },
  { path: '/privacy/', title: 'Privacy', description: 'How Project Quantity Lab handles local project data, share links, logs, and future third parties.' },
  { path: '/terms/', title: 'Terms and estimate disclaimer', description: 'Planning-estimate limitations, acceptable use, and user responsibilities.' },
  { path: '/security/', title: 'Security', description: 'Security design, reporting channel, deployment boundary, and supported product surface.' },
  { path: '/access/', title: 'Access for people and agents', description: 'Anonymous access, browser-local state, and the absence of accounts or a protected API.' },
] as const;

export const publicRoutes = [
  { path: '/', title: 'Home Project Material Calculators', description: SITE.description, kind: 'home' },
  { path: '/calculators/', title: 'Home Project Calculators', description: 'Choose a substantial, product-neutral material planner for paint, floors, landscaping, concrete, or fencing.', kind: 'hub' },
  ...calculators.map((item) => ({ path: `/calculators/${item.slug}/`, title: item.name, description: item.description, kind: 'calculator' })),
  { path: '/guides/', title: 'Home Project Measurement Guides', description: 'Practical guides for measuring, selecting waste, comparing packages, and checking project assumptions.', kind: 'hub' },
  ...guides.map((item) => ({ path: `/guides/${item.slug}/`, title: item.title, description: item.description, kind: 'guide' })),
  ...trustRoutes.map((item) => ({ ...item, kind: 'trust' })),
] as const;

export const calculatorBySlug = Object.fromEntries(calculators.map((item) => [item.slug, item])) as Record<CalculatorSlug, CalculatorDefinition>;
export const guideBySlug = Object.fromEntries(guides.map((item) => [item.slug, item])) as Record<string, GuideDefinition>;

export function absolute(path: string) {
  return new URL(path, SITE.origin).toString();
}

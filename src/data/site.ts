export const SITE = {
  name: 'Project Quantity Lab',
  origin: 'https://home.utilitas.app',
  contactEmail: 'contact@home.utilitas.app',
  description: 'Free, product-neutral calculators for home project materials, costs, and printable shopping lists.',
  updated: '2026-08-06',
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
    guides: ['measure-room-for-paint', 'paint-coverage', 'spray-paint-coverage', 'paint-coats', 'subtract-doors-windows', 'painting-shopping-checklist'],
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
    guides: ['measure-fence-runs', 'fence-post-spacing', 'how-many-fence-boards'],
  },
];

export interface GuideDefinition {
  slug: string;
  title: string;
  description: string;
  category: CalculatorSlug;
  readingTime: string;
  datePublished?: string;
  dateModified?: string;
  intro: string;
  sections: Array<{ heading: string; paragraphs: string[]; steps?: string[] }>;
  takeaway: string;
  sources?: Array<{ label: string; url: string }>;
}

export const guides: GuideDefinition[] = [
  {
  "slug": "cubic-yards-to-tonnes-landscape-materials",
  "title": "Cubic yards to tonnes: ordering landscape materials",
  "description": "Convert a landscape volume into an estimated weight using the supplier’s bulk density, with clear units, an example and questions to ask before delivery.",
  "category": "landscape-materials",
  "readingTime": "6 min",
  "datePublished": "2026-09-29",
  "dateModified": "2026-09-29",
  "intro": "There is no single conversion from cubic yards to tonnes for mulch, soil or gravel. A cubic yard measures volume; a tonne measures mass. To connect them, use the bulk density for the exact material and condition quoted by the supplier. Calculate the volume first, then make a separate, labelled weight estimate.",
  "sections": [
    {
      "heading": "Keep volume and weight in separate columns",
      "paragraphs": [
        "A bed or path measurement gives a volume from area multiplied by depth. That is the starting point for the landscape calculator. A supplier may sell the material by cubic yard, cubic metre, bag or tonne, so the quote can use a different unit from the plan. Do not replace one label with another while leaving the number unchanged.",
        "A tonne, also called a metric ton, is 1,000 kilograms. It is not the same unit as a US short ton of 2,000 pounds. NIST lists these as separate units in its conversion tables. Ask which unit a quote means when it says ton, particularly when comparing Canadian and US information."
      ]
    },
    {
      "heading": "Request the density that matches the order",
      "paragraphs": [
        "Ask the supplier for the approximate bulk density of the specific product in its supplied condition, including the units. A figure in tonnes per cubic metre cannot be applied directly to a volume still expressed in cubic yards. Also ask whether the figure describes loose material, compacted material, or another stated condition.",
        "Do not substitute the density of solid stone for the bulk density of a pile of aggregate. The pile includes spaces between pieces. Moisture, the mix of particle sizes and handling conditions can change a practical weight estimate, so a generic internet conversion is not a substitute for a supplier-specific quotation. If the supplier cannot give a usable conversion, request a quote directly for the measured volume."
      ]
    },
    {
      "heading": "Work through an explicitly hypothetical example",
      "paragraphs": [
        "Suppose your measured plan, after its chosen volume allowance, is 2.5 cubic yards. One cubic yard is approximately 0.764555 cubic metres, using the NIST conversion factor. The volume is therefore 2.5 × 0.764555 = 1.9114 cubic metres. Keep a few decimal places until the purchase unit is chosen.",
        "For this example only, suppose the supplier quotes a loose bulk density of 1.6 tonnes per cubic metre. The estimated mass is 1.9114 × 1.6 = 3.0582 tonnes, or approximately 3.06 tonnes. The 1.6 value is an invented teaching input, not a recommended density for your gravel, soil or mulch. Replace it with the supplier’s figure before ordering.",
        "If the quote is instead per tonne, multiply the estimated tonnes by that price and then add delivery and any stated minimums. If the supplier bills by a measured load weight, confirm how the final charge is determined. A calculated estimate is not a weighbridge ticket."
      ]
    },
    {
      "heading": "Keep compaction allowances out of the unit conversion",
      "paragraphs": [
        "Converting cubic yards to cubic metres changes units, not the physical quantity. A compaction or settling allowance changes the quantity being ordered. Treat those as two different operations and record both so that the same allowance is not quietly applied twice.",
        "For example, if your saved landscape plan already includes an allowance before it displays 2.5 cubic yards, do not automatically add another percentage when multiplying by density. Ask the supplier or installer whether the original allowance suits the material and intended use. This calculator estimates quantities; it does not specify a structural base or a compaction procedure."
      ]
    },
    {
      "heading": "Use a weight estimate to plan delivery questions",
      "paragraphs": [
        "A volume calculator cannot approve a vehicle load. If you are considering collection, confirm the permitted payload and all relevant vehicle, trailer and loading limits with the appropriate documentation and supplier. Account for passengers, tools and other cargo rather than treating the entire published capacity as available material weight.",
        "For delivery, discuss access, the unloading location, minimum order, vehicle requirements and what happens if the site cannot accept the load. A cheaper tonne price may not produce a cheaper usable order once the delivery arrangement is included. Compare the same material, quantity basis and delivery scope."
      ],
      "steps": [
        "Save the area, depth and allowance used for the volume.",
        "Confirm the sales unit and the meaning of ton or tonne.",
        "Get the exact product’s density and its loose or compacted basis.",
        "Convert volume units before multiplying by density.",
        "Confirm ordering increments, final billing and delivery access."
      ]
    }
  ],
  "takeaway": "Order from a documented volume and a supplier-confirmed conversion. Preserve the density assumption in the saved plan so another quote can be compared without guessing.",
  "sources": [
    {
      "label": "NIST: volume and mass conversion factors",
      "url": "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8"
    },
    {
      "label": "USDA NRCS: bulk density, pore space and moisture",
      "url": "https://www.nrcs.usda.gov/sites/default/files/2022-10/Soil%20Bulk%20Density%20Moisture%20Aeration.pdf"
    }
  ]
},
  {
  "slug": "tile-box-coverage-nominal-size",
  "title": "Tile box coverage: why nominal size is not enough",
  "description": "Use the exact tile carton coverage to turn a measured area into whole boxes, while keeping nominal size, actual dimensions and waste separate.",
  "category": "flooring-tile",
  "readingTime": "6 min",
  "datePublished": "2026-09-08",
  "dateModified": "2026-09-08",
  "intro": "For a tile purchase estimate, use the coverage printed for the exact product and carton. Do not assume a tile sold as 12 by 24 inches gives exactly two square feet of coverage per piece. Nominal size is a product label; actual dimensions, installation spacing and the manufacturer's coverage basis can differ.",
  "sections": [
    {
      "heading": "Separate three measurements before calculating",
      "paragraphs": [
        "Record the product's nominal size, the actual face dimensions and the stated coverage per carton as separate fields. The nominal size helps identify the format. Actual dimensions matter when checking layout and fit. Carton coverage is the purchasing input that converts a measured area into packages.",
        "Zia Tile's ceramic specification illustrates the distinction by listing nominal dimensions, actual dimensions, pieces per box and square feet per box in separate columns. Its existence is useful evidence that these quantities should not be collapsed into one number. The specification describes that manufacturer's ceramic products; it is not a universal conversion table or evidence that a wall tile is suitable for a floor."
      ]
    },
    {
      "heading": "Read the exact product record",
      "paragraphs": [
        "Match the product code, finish, size and packaging on the seller's listing to the carton or current technical sheet. A per-piece price, a per-square-foot price and a per-box price are different purchasing units. Write down the coverage and its unit beside the price so that a cheap-looking number does not silently become the wrong box cost.",
        "If the listed area and your own piece-area calculation disagree, ask the supplier which coverage figure to use and whether it includes installation spacing. Do not fix the discrepancy by inventing a grout allowance. Mosaic sheets, irregular shapes and multi-size patterns deserve a product-specific coverage explanation and a layout check."
      ],
      "steps": [
        "Identify the exact product and intended floor or wall use.",
        "Record the carton coverage in square feet or square metres.",
        "Record pieces or sheets per carton as a separate count.",
        "Confirm the price unit and whether only full cartons can be ordered."
      ]
    },
    {
      "heading": "Work through one whole-box example",
      "paragraphs": [
        "Suppose a measured area is 142 square feet. For this illustration only, the installer and buyer choose a 10% allowance for the layout, giving 142 × 1.10 = 156.2 square feet to purchase before package rounding. A carton marked 15.5 square feet gives 156.2 ÷ 15.5 = 10.08 cartons, which rounds up to 11 cartons.",
        "Those 11 cartons provide 170.5 square feet, leaving 28.5 square feet above the measured area. That total includes both the chosen allowance and additional material caused by full-carton rounding. Do not add another 10% after rounding unless you are intentionally buying a separately documented reserve. The 10% here is an example, not a recommendation for every installation."
      ]
    },
    {
      "heading": "Enter coverage and units in the planner",
      "paragraphs": [
        "In the flooring and tile calculator, enter the measured areas, select the relevant measurement units, choose your allowance and use the exact box coverage from the product record. Keep a note of the product code with the saved plan. The quantity estimate is only as transferable as the packaging assumption attached to it.",
        "If the room was measured in square metres but a supplier quotes square feet per box, convert one side consistently before comparing. As a useful check, one square metre is approximately 10.764 square feet. Never mix a number measured in metres with an area expressed in square feet just because both appear in the same product listing."
      ]
    },
    {
      "heading": "Keep layout and installation materials separate",
      "paragraphs": [
        "An area estimate cannot confirm that a particular pattern will fit without narrow edge cuts, that an offcut can be reused elsewhere, or that every delivered tile is suitable for the intended location. Confirm layout and product suitability with the installer before treating the calculated carton count as the final order.",
        "Grout, mortar, underlayment, trims and movement-joint materials need their own product instructions and quantities. Tile carton coverage does not predict their consumption. Keep those items on separate shopping-list lines, then verify the carton labels and product codes when the order arrives. Sources and the purchasing method were reviewed September 8, 2026."
      ]
    }
  ],
  "takeaway": "Measure the surface, document the allowance, divide by the exact carton coverage and round once to the purchasable package. Keep the product label with the estimate so another person can reproduce the count.",
  "sources": [
    {
      "label": "Zia Tile ceramic specification: nominal size, actual size and carton coverage",
      "url": "https://support.ziatile.com/hc/en-us/article_attachments/15587349901844"
    }
  ]
},
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
    description: 'Compare gallon, five-gallon, quart, and litre paint coverage, then adjust label area for coats, porosity, and waste.',
    intro: 'A common planning value is around 350 to 400 square feet per US gallon for one coat, but the product label is the source that matters. Coverage is affected by the coating, surface, roller nap, application method, film thickness, and substrate.',
    sections: [
      { heading: 'Direct container-size answers', paragraphs: ['At a label rate of 400 square feet per US gallon, one quart covers 100 square feet, one gallon covers 400 square feet, five gallons covers 2,000 square feet, and one litre covers about 105.7 square feet or 9.8 square metres for one coat. These are conversions of an example label rate, not universal product promises.'] },
      { heading: 'Coverage is per coat', paragraphs: ['If a wall needs two coats, its area consumes coverage twice. A 400 sq ft wall with 400 sq ft/gal coverage needs about two gallons for two coats before contingency, not one. The same rule reduces a five-gallon pail from 2,000 square feet for one coat to 1,000 square feet for two coats.'] },
      { heading: 'Porous surfaces use more', paragraphs: ['Fresh drywall, masonry, repaired areas, and rough texture can absorb more coating. Primer can reduce uneven absorption, but its own coverage also varies.'] },
      { heading: 'Primer, exterior, oil, and gloss coverage', paragraphs: ['Do not assume that primer, exterior paint, oil paint, gloss paint, and interior wall paint share one spread rate. Even products from the same brand can differ by product line, sheen, colour base, and recommended film thickness. Use the exact can label or technical data sheet in the calculator.'] },
      { heading: 'Exact volume versus shopping quantity', paragraphs: ['The formula produces a continuous volume, while stores sell discrete cans. Keep both numbers: exact volume explains the math; rounded containers form the shopping list.'] },
    ], takeaway: 'Enter the actual label coverage and keep a modest contingency. Product-specific data beats a universal rule of thumb.',
    sources: [
      { label: 'Benjamin Moore Regal Select technical data sheet', url: 'https://media.benjaminmoore.com/WebServices/prod/assets/production/datasheets/TDS_0549/N549_TDS_US.pdf' },
      { label: 'Sherwin-Williams paint calculator guidance', url: 'https://www.sherwin-williams.com/en-us/color/color-tools/paint-calculator' },
    ]
  },
  {
    slug: 'spray-paint-coverage', title: 'How much does a can of spray paint cover?', category: 'paint', readingTime: '6 min',
    description: 'Estimate spray-paint cans from label coverage, coats, object geometry, surface texture, and overspray loss.',
    intro: 'There is no single square-foot answer for every spray can. Aerosol size alone does not establish coverage: formulation, colour, nozzle, surface, object shape, film thickness, and spraying technique all affect how much painted area a can produces.',
    sections: [
      { heading: 'Start with the label area', paragraphs: ['Find the coverage area stated on the can or technical data sheet and treat it as a one-coat planning maximum under the listed conditions. Do not convert aerosol fluid ounces into wall-paint gallon coverage because the products and application losses are different.'] },
      { heading: 'Divide by coats and contingency', paragraphs: ['Practical project area = number of cans × label area per can ÷ coats ÷ (1 + contingency). If one can lists 12 square feet, two coats with 20% contingency plans for 5 square feet of finished project area.'] },
      { heading: 'Geometry creates overspray', paragraphs: ['A flat panel captures more of the spray pattern than chair spindles, wire shelving, railings, or small separate parts. Paint passing between or beyond the object is still consumed, so open shapes need a larger contingency.'] },
      { heading: 'Technique changes the result', paragraphs: ['Use the distance, movement, temperature, ventilation, and recoat directions on the product. Multiple light coats are commonly specified for aerosol products. Heavy passes can sag without improving useful coverage.'] },
      { heading: 'Count every coated face', paragraphs: ['Measure each face that will receive paint. For a rectangular object, include front, back, sides, top, and bottom as applicable. Curved and irregular objects can be approximated with simple rectangles and a conservative allowance.'] },
    ], takeaway: 'Use the spray can label in the paint coverage calculator, count every coat, and increase contingency for open or complex shapes.',
    sources: [
      { label: 'Rust-Oleum Painter’s Touch 2X product guidance', url: 'https://www.rustoleum.com/product-catalog/consumer-brands/painters-touch-2x-ultra-cover' },
    ]
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
    slug: 'when-to-order-ready-mix', title: 'How to order ready-mix concrete', category: 'concrete', readingTime: '8 min',
    description: 'Plan a ready-mix order, ask about minimum and short-load charges, and confirm slump, volume, access, timing, and truck type.',
    intro: 'Ordering ready-mix is more than naming a cubic-yard total. The supplier needs enough information to provide the specified concrete, schedule production, reach the placement, and discharge at a rate the crew can handle.',
    sections: [
      { heading: 'Count batches and handling', paragraphs: ['Divide total volume by mixer capacity and estimate the time for every batch. Include moving bags, water measurement, and moving wet concrete to the forms.'] },
      { heading: 'Ask about minimums and short loads', paragraphs: ['There is no universal minimum concrete order. A producer may deliver less than a full truck but apply a minimum-load, short-load, delivery, waiting, environmental, or returned-concrete charge. Ask for the smallest delivered quantity and total delivered price before comparing it with bagged concrete.'] },
      { heading: 'State quantity with contingency', paragraphs: ['Ready-mix is sold by volume in cubic yards or cubic metres. NRMCA recommends ordering 4% to 10% more than plan dimensions to cover contingencies. The calculator keeps this allowance visible instead of hiding it in the measurements.'] },
      { heading: 'Order the required performance', paragraphs: ['Provide the project specification when one exists. Confirm the application, specified strength, exposure, air entrainment where required, aggregate size, placement method, and any other designer requirements with the producer. Do not invent a structural mix from a generic article.'] },
      { heading: 'Understand slump', paragraphs: ['Slump measures fresh-concrete consistency, not strength by itself. The appropriate target depends on the mixture, forms, reinforcement, placement, pumping, and specification. Ask the producer or project professional for the suitable mix rather than adding uncontrolled water at the site.'] },
      { heading: 'Ready-mix truck or volumetric mixer', paragraphs: ['A drum truck carries concrete batched for delivery. A volumetric mixer meters ingredients and mixes on site, which can suit small, staged, or uncertain quantities. Availability, certification, mixture control, minimums, and pricing vary locally, so compare suppliers against the same project requirements.'] },
      { heading: 'Prepare access, crew, and schedule', paragraphs: ['Confirm truck dimensions and weight, street and driveway access, overhead clearance, discharge reach, pump or buggy needs, washout, crew size, delivery rate, weather plan, and placement duration. The crew and forms should be ready before the truck arrives.'] },
    ], takeaway: 'Give the producer the project requirements, volume, placement method, site logistics, and schedule, then request a total delivered quote with every minimum and extra charge listed.',
    sources: [
      { label: 'NRMCA CIP 31: Ordering Ready Mixed Concrete', url: 'https://www.nrmca.org/wp-content/uploads/2021/01/31pr.pdf' },
      { label: 'American Concrete Institute: How is workability measured and specified?', url: 'https://www.concrete.org/frequentlyaskedquestions/faqid/738.aspx' },
    ]
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
  {
    slug: 'how-many-fence-boards', title: 'How many fence boards do I need?', category: 'fence', readingTime: '8 min',
    description: 'Calculate fence-board or picket quantities from measured runs, actual board width, spacing, gates, layout style, and a stated waste allowance.',
    intro: 'To estimate fence boards, divide the usable run length by the coverage of one board and its gap, then round up. That simple formula works only after you separate gates and decide whether boards are spaced, butted, overlapping, or installed on both faces.',
    sections: [
      {
        heading: 'Measure usable fence runs',
        paragraphs: [
          'Sketch each straight run between corner, terminal, and gate posts. Record horizontal run length in one unit, then subtract openings that will be filled by gates or another material. Keep each run separate because end conditions and spacing adjustments occur independently.',
          'Confirm property boundaries, utilities, height limits, setbacks, wind exposure, and structural requirements before buying. A quantity estimate does not select post depth, rail size, fasteners, or a code-compliant fence system.',
        ],
      },
      {
        heading: 'Use actual board width and the intended pattern',
        paragraphs: [
          'Measure the face width of the product rather than relying on a nominal lumber name. For a spaced picket pattern, one repeat covers the actual board width plus the intended gap. For tightly butted boards, the starting estimate uses board width alone, but wet or dry wood movement and manufacturer instructions still affect installation spacing.',
          'Overlapping patterns need a different effective coverage. For board-on-board, subtract the overlap from the board width for the repeating exposure, then account for the starter and end conditions. Shadowbox layouts place boards on alternating faces, so calculate each face from the selected pattern instead of doubling a single-sided count without checking the overlap.',
        ],
      },
      {
        heading: 'Calculate and round each run',
        paragraphs: [
          'For ordinary spaced pickets, convert run length and board width to the same unit, then divide run length by board width plus gap. Round up to a whole board. For example, a 96 inch bay using boards with an actual 5.5 inch face and a 0.5 inch target gap starts with 96 divided by 6, or 16 repeating spaces.',
          'A real layout also has a first and last edge. Dry-lay or mark the bay and distribute the leftover distance across the gaps so the final board is not a narrow rip. Lowe\'s published fence worksheet uses the same base method: fence length in inches divided by actual picket width plus spacing, with the result treated as an estimate.',
        ],
      },
      {
        heading: 'Handle gates, corners, and waste separately',
        paragraphs: [
          'Subtract the clear gate opening from ordinary board coverage, then add any boards used to build the gate leaf according to its design. Corners, returns, grade changes, and trimmed end boards can consume material that a continuous-run formula does not show.',
          'Add a stated allowance for damaged pieces, knots, colour selection, cuts, and future repairs. Use the selected product quality and layout to choose the allowance rather than copying a universal percentage. Keep the exact calculated count and the purchase count visible so the reason for the extra material remains auditable.',
        ],
      },
      {
        heading: 'Turn the count into a complete shopping check',
        paragraphs: [
          'Use the fence calculator to model runs, posts, sections, panels, gates, and optional pricing. Then add rails, fasteners, post material, concrete, caps, preservative for cut ends, and any project-specific hardware from the chosen system instructions.',
          'Before checkout, compare the calculator inputs with a physical sample or current product specification. Actual board width, panel module, moisture condition, local rules, and site layout can change the count even when the arithmetic is correct.',
        ],
      },
    ],
    takeaway: 'Keep run length, actual board width, gap or overlap, gate deductions, exact count, and purchase allowance on the same worksheet so every board can be traced to an assumption.'
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
  { path: '/calculators/', title: 'Home Project Calculators', description: 'Choose a product-neutral calculator for paint coverage, room paint, floors, landscaping, concrete, or fencing.', kind: 'hub' },
  { path: '/calculators/paint-coverage/', title: 'Paint Coverage Calculator for Gallons, Quarts, Litres, and Spray Cans', description: 'Calculate how many square feet or square metres a quart, gallon, five-gallon pail, litre, or spray can will cover after coats and contingency.', kind: 'calculator' },
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

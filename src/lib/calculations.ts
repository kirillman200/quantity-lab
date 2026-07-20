export type UnitSystem = 'imperial' | 'metric';
export type AreaShape = 'rectangle' | 'circle' | 'triangle';
export type ConcreteShape = 'slab' | 'footing' | 'post' | 'steps';

export interface AreaInput {
  id: string;
  name: string;
  shape: AreaShape;
  length: number;
  width: number;
  diameter: number;
}

export interface PaintRoom {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  doors: number;
  windows: number;
  ceiling: boolean;
}

export interface ConcreteSection {
  id: string;
  name: string;
  shape: ConcreteShape;
  length: number;
  width: number;
  depth: number;
  diameter: number;
  count: number;
  rise: number;
  run: number;
}

export interface FenceRun {
  id: string;
  name: string;
  length: number;
  gates: number;
  gateWidth: number;
}

export interface QuantityResult {
  exact: number;
  packages: number;
  cost: number;
}

const SQM_TO_SQFT = 10.7639104167;
const CUBIC_METRE_TO_CUBIC_FEET = 35.3146667215;
const LITRES_PER_US_GALLON = 3.785411784;

export function finiteNonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function round(value: number, places = 2): number {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function lengthToFeet(value: number, unit: UnitSystem): number {
  return finiteNonNegative(value) * (unit === 'metric' ? 3.280839895 : 1);
}

export function areaToSquareFeet(value: number, unit: UnitSystem): number {
  return finiteNonNegative(value) * (unit === 'metric' ? SQM_TO_SQFT : 1);
}

export function squareFeetToDisplay(value: number, unit: UnitSystem): number {
  return unit === 'metric' ? value / SQM_TO_SQFT : value;
}

export function cubicFeetToDisplay(value: number, unit: UnitSystem): number {
  return unit === 'metric' ? value / CUBIC_METRE_TO_CUBIC_FEET : value;
}

export function areaOfShape(input: AreaInput, unit: UnitSystem): number {
  const length = lengthToFeet(input.length, unit);
  const width = lengthToFeet(input.width, unit);
  const diameter = lengthToFeet(input.diameter, unit);
  if (input.shape === 'circle') return Math.PI * (diameter / 2) ** 2;
  if (input.shape === 'triangle') return (length * width) / 2;
  return length * width;
}

export interface PaintInput {
  rooms: PaintRoom[];
  unit: UnitSystem;
  doorArea: number;
  windowArea: number;
  coats: number;
  primerCoats: number;
  coverage: number;
  primerCoverage: number;
  waste: number;
  containerSize: number;
  containerPrice: number;
  primerContainerPrice: number;
}

export interface PaintResult {
  wallArea: number;
  ceilingArea: number;
  openingsArea: number;
  netArea: number;
  paint: QuantityResult;
  primer: QuantityResult;
}

export function calculatePaint(input: PaintInput): PaintResult {
  const doorAreaFt = areaToSquareFeet(input.doorArea, input.unit);
  const windowAreaFt = areaToSquareFeet(input.windowArea, input.unit);
  let wallArea = 0;
  let ceilingArea = 0;
  let openingsArea = 0;

  for (const room of input.rooms) {
    const length = lengthToFeet(room.length, input.unit);
    const width = lengthToFeet(room.width, input.unit);
    const height = lengthToFeet(room.height, input.unit);
    wallArea += 2 * (length + width) * height;
    if (room.ceiling) ceilingArea += length * width;
    openingsArea += finiteNonNegative(room.doors) * doorAreaFt + finiteNonNegative(room.windows) * windowAreaFt;
  }

  const netArea = Math.max(0, wallArea + ceilingArea - openingsArea);
  const wasteFactor = 1 + finiteNonNegative(input.waste) / 100;
  const paintCoverageFt = input.unit === 'metric'
    ? finiteNonNegative(input.coverage) * SQM_TO_SQFT * LITRES_PER_US_GALLON
    : finiteNonNegative(input.coverage);
  const primerCoverageFt = input.unit === 'metric'
    ? finiteNonNegative(input.primerCoverage) * SQM_TO_SQFT * LITRES_PER_US_GALLON
    : finiteNonNegative(input.primerCoverage);
  const containerGallons = input.unit === 'metric'
    ? finiteNonNegative(input.containerSize) / LITRES_PER_US_GALLON
    : finiteNonNegative(input.containerSize);

  const exactPaintGallons = paintCoverageFt ? netArea * finiteNonNegative(input.coats) * wasteFactor / paintCoverageFt : 0;
  const exactPrimerGallons = primerCoverageFt ? netArea * finiteNonNegative(input.primerCoats) * wasteFactor / primerCoverageFt : 0;
  const paintPackages = containerGallons ? Math.ceil(exactPaintGallons / containerGallons) : 0;
  const primerPackages = containerGallons && exactPrimerGallons ? Math.ceil(exactPrimerGallons / containerGallons) : 0;

  const displayVolume = (gallons: number) => input.unit === 'metric' ? gallons * LITRES_PER_US_GALLON : gallons;
  return {
    wallArea: squareFeetToDisplay(wallArea, input.unit),
    ceilingArea: squareFeetToDisplay(ceilingArea, input.unit),
    openingsArea: squareFeetToDisplay(openingsArea, input.unit),
    netArea: squareFeetToDisplay(netArea, input.unit),
    paint: { exact: displayVolume(exactPaintGallons), packages: paintPackages, cost: paintPackages * finiteNonNegative(input.containerPrice) },
    primer: { exact: displayVolume(exactPrimerGallons), packages: primerPackages, cost: primerPackages * finiteNonNegative(input.primerContainerPrice) },
  };
}

export interface FlooringInput {
  areas: AreaInput[];
  unit: UnitSystem;
  pieceLength: number;
  pieceWidth: number;
  pieceUnit: 'inch' | 'cm';
  packageCoverage: number;
  waste: number;
  packagePrice: number;
}

export interface FlooringResult {
  area: number;
  purchaseArea: number;
  pieceArea: number;
  pieces: number;
  packages: number;
  cost: number;
}

export function calculateFlooring(input: FlooringInput): FlooringResult {
  const areaFt = input.areas.reduce((total, area) => total + areaOfShape(area, input.unit), 0);
  const purchaseFt = areaFt * (1 + finiteNonNegative(input.waste) / 100);
  const pieceLengthFt = finiteNonNegative(input.pieceLength) / (input.pieceUnit === 'cm' ? 30.48 : 12);
  const pieceWidthFt = finiteNonNegative(input.pieceWidth) / (input.pieceUnit === 'cm' ? 30.48 : 12);
  const pieceAreaFt = pieceLengthFt * pieceWidthFt;
  const packageCoverageFt = areaToSquareFeet(input.packageCoverage, input.unit);
  const packages = packageCoverageFt ? Math.ceil(purchaseFt / packageCoverageFt) : 0;
  return {
    area: squareFeetToDisplay(areaFt, input.unit),
    purchaseArea: squareFeetToDisplay(purchaseFt, input.unit),
    pieceArea: squareFeetToDisplay(pieceAreaFt, input.unit),
    pieces: pieceAreaFt ? Math.ceil(purchaseFt / pieceAreaFt) : 0,
    packages,
    cost: packages * finiteNonNegative(input.packagePrice),
  };
}

export interface LandscapeInput {
  areas: AreaInput[];
  unit: UnitSystem;
  depth: number;
  depthUnit: 'inch' | 'cm';
  waste: number;
  bagVolume: number;
  bagVolumeUnit: 'cubic-feet' | 'litres';
  bagPrice: number;
  bulkPrice: number;
}

export interface LandscapeResult {
  area: number;
  cubicFeet: number;
  cubicYards: number;
  cubicMetres: number;
  bags: number;
  bagCost: number;
  bulkUnits: number;
  bulkCost: number;
  cheapest: 'bags' | 'bulk' | 'equal';
}

export function calculateLandscape(input: LandscapeInput): LandscapeResult {
  const areaFt = input.areas.reduce((total, area) => total + areaOfShape(area, input.unit), 0);
  const depthFt = finiteNonNegative(input.depth) / (input.depthUnit === 'cm' ? 30.48 : 12);
  const cubicFeet = areaFt * depthFt * (1 + finiteNonNegative(input.waste) / 100);
  const bagCubicFeet = input.bagVolumeUnit === 'litres'
    ? finiteNonNegative(input.bagVolume) / 28.316846592
    : finiteNonNegative(input.bagVolume);
  const bags = bagCubicFeet ? Math.ceil(cubicFeet / bagCubicFeet) : 0;
  const bulkExact = input.unit === 'metric' ? cubicFeet / CUBIC_METRE_TO_CUBIC_FEET : cubicFeet / 27;
  const bulkUnits = Math.ceil(bulkExact * 4) / 4;
  const bagCost = bags * finiteNonNegative(input.bagPrice);
  const bulkCost = bulkUnits * finiteNonNegative(input.bulkPrice);
  const cheapest = bagCost === bulkCost ? 'equal' : bagCost < bulkCost ? 'bags' : 'bulk';
  return {
    area: squareFeetToDisplay(areaFt, input.unit),
    cubicFeet,
    cubicYards: cubicFeet / 27,
    cubicMetres: cubicFeet / CUBIC_METRE_TO_CUBIC_FEET,
    bags,
    bagCost,
    bulkUnits,
    bulkCost,
    cheapest,
  };
}

export interface ConcretePackage {
  id: string;
  name: string;
  yieldCubicFeet: number;
  price: number;
}

export interface ConcreteInput {
  sections: ConcreteSection[];
  unit: UnitSystem;
  waste: number;
  packages: ConcretePackage[];
}

export interface ConcretePackageResult extends ConcretePackage {
  bags: number;
  cost: number;
}

export interface ConcreteResult {
  rawCubicFeet: number;
  purchaseCubicFeet: number;
  cubicYards: number;
  cubicMetres: number;
  packageResults: ConcretePackageResult[];
  cheapestPackageId: string | null;
}

export function concreteSectionVolume(section: ConcreteSection, unit: UnitSystem): number {
  const length = lengthToFeet(section.length, unit);
  const width = lengthToFeet(section.width, unit);
  const depth = lengthToFeet(section.depth, unit);
  const diameter = lengthToFeet(section.diameter, unit);
  const rise = lengthToFeet(section.rise, unit);
  const run = lengthToFeet(section.run, unit);
  const count = Math.max(1, Math.floor(finiteNonNegative(section.count)));
  if (section.shape === 'post') return Math.PI * (diameter / 2) ** 2 * depth * count;
  if (section.shape === 'steps') return width * rise * run * count;
  return length * width * depth * count;
}

export function calculateConcrete(input: ConcreteInput): ConcreteResult {
  const rawCubicFeet = input.sections.reduce((total, section) => total + concreteSectionVolume(section, input.unit), 0);
  const purchaseCubicFeet = rawCubicFeet * (1 + finiteNonNegative(input.waste) / 100);
  const packageResults = input.packages.map((item) => {
    const bags = item.yieldCubicFeet > 0 ? Math.ceil(purchaseCubicFeet / item.yieldCubicFeet) : 0;
    return { ...item, bags, cost: bags * finiteNonNegative(item.price) };
  });
  const priced = packageResults.filter((item) => item.price > 0 && item.yieldCubicFeet > 0);
  const cheapest = priced.reduce<ConcretePackageResult | null>((best, item) => !best || item.cost < best.cost ? item : best, null);
  return {
    rawCubicFeet,
    purchaseCubicFeet,
    cubicYards: purchaseCubicFeet / 27,
    cubicMetres: purchaseCubicFeet / CUBIC_METRE_TO_CUBIC_FEET,
    packageResults,
    cheapestPackageId: cheapest?.id ?? null,
  };
}

export interface FenceInput {
  runs: FenceRun[];
  unit: UnitSystem;
  spacing: number;
  railsPerSection: number;
  picketWidth: number;
  picketGap: number;
  postPrice: number;
  panelPrice: number;
  railPrice: number;
  picketPrice: number;
  concreteBagsPerPost: number;
  concreteBagPrice: number;
}

export interface FenceResult {
  grossLength: number;
  gateLength: number;
  netLength: number;
  sections: number;
  linePosts: number;
  gatePosts: number;
  totalPosts: number;
  rails: number;
  pickets: number;
  concreteBags: number;
  cost: number;
}

export function calculateFence(input: FenceInput): FenceResult {
  const spacingFt = lengthToFeet(input.spacing, input.unit);
  let grossFt = 0;
  let gateFt = 0;
  let sections = 0;
  let linePosts = 0;
  let gatePosts = 0;
  for (const run of input.runs) {
    const runFt = lengthToFeet(run.length, input.unit);
    const gates = Math.floor(finiteNonNegative(run.gates));
    const runGateFt = lengthToFeet(run.gateWidth, input.unit) * gates;
    const netRunFt = Math.max(0, runFt - runGateFt);
    const runSections = spacingFt ? Math.ceil(netRunFt / spacingFt) : 0;
    grossFt += runFt;
    gateFt += runGateFt;
    sections += runSections;
    if (runSections > 0) linePosts += runSections + 1;
    gatePosts += gates * 2;
  }
  const netFt = Math.max(0, grossFt - gateFt);
  const pitchFt = input.unit === 'metric'
    ? (finiteNonNegative(input.picketWidth) + finiteNonNegative(input.picketGap)) / 100
    : (finiteNonNegative(input.picketWidth) + finiteNonNegative(input.picketGap)) / 12;
  const pickets = pitchFt ? Math.ceil(netFt / pitchFt) : 0;
  const rails = sections * Math.floor(finiteNonNegative(input.railsPerSection));
  const totalPosts = linePosts + gatePosts;
  const concreteBags = Math.ceil(totalPosts * finiteNonNegative(input.concreteBagsPerPost));
  const cost = totalPosts * finiteNonNegative(input.postPrice)
    + sections * finiteNonNegative(input.panelPrice)
    + rails * finiteNonNegative(input.railPrice)
    + pickets * finiteNonNegative(input.picketPrice)
    + concreteBags * finiteNonNegative(input.concreteBagPrice);
  return {
    grossLength: input.unit === 'metric' ? grossFt / 3.280839895 : grossFt,
    gateLength: input.unit === 'metric' ? gateFt / 3.280839895 : gateFt,
    netLength: input.unit === 'metric' ? netFt / 3.280839895 : netFt,
    sections, linePosts, gatePosts, totalPosts, rails, pickets, concreteBags, cost,
  };
}

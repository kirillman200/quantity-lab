<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import {
  calculateConcrete,
  calculateFence,
  calculateFlooring,
  calculateLandscape,
  calculatePaint,
  round,
  type AreaInput,
  type ConcretePackage,
  type ConcreteSection,
  type FenceRun,
  type PaintRoom,
  type UnitSystem,
} from '../lib/calculations';
import type { CalculatorSlug } from '../data/site';
import CalculationVisual from './CalculationVisual.vue';

const props = defineProps<{ kind: CalculatorSlug; accent: string }>();
const unit = ref<UnitSystem>('imperial');
const projectName = ref('Weekend project');
const message = ref('');
const hasCalculated = ref(false);
const suppressUnitConversion = ref(false);
let nextId = 2;

const makeId = () => `item-${Date.now()}-${nextId++}`;
const cleanName = (value: unknown, fallback: string) => typeof value === 'string' ? value.slice(0, 60) : fallback;
const num = (value: unknown, fallback: number, min = 0, max = 1_000_000) => typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
const bool = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback;
const objectValue = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};

const paint = reactive({
  rooms: [{ id: 'room-1', name: 'Room 1', length: 12, width: 10, height: 8, doors: 1, windows: 2, ceiling: false }] as PaintRoom[],
  doorArea: 21, windowArea: 15, coats: 2, primerCoats: 1, coverage: 400, primerCoverage: 350, waste: 10, containerSize: 1, containerPrice: 42, primerContainerPrice: 32,
});

const flooring = reactive({
  areas: [{ id: 'area-1', name: 'Main room', shape: 'rectangle', length: 12, width: 14, diameter: 0 }] as AreaInput[],
  pieceLength: 48, pieceWidth: 8, pieceUnit: 'inch' as 'inch' | 'cm', packageCoverage: 20, waste: 10, packagePrice: 58,
});

const landscape = reactive({
  areas: [{ id: 'bed-1', name: 'Front bed', shape: 'rectangle', length: 20, width: 6, diameter: 0 }] as AreaInput[],
  depth: 3, depthUnit: 'inch' as 'inch' | 'cm', waste: 10, bagVolume: 2, bagVolumeUnit: 'cubic-feet' as 'cubic-feet' | 'litres', bagPrice: 6.5, bulkPrice: 52,
});

const concrete = reactive({
  sections: [{ id: 'pour-1', name: 'Main slab', shape: 'slab', length: 10, width: 8, depth: .3333, diameter: 0, count: 1, rise: 0, run: 0 }] as ConcreteSection[],
  waste: 10,
  packages: [
    { id: 'bag-small', name: '60 lb / 27 kg bag', yieldCubicFeet: .45, price: 6.2 },
    { id: 'bag-large', name: '80 lb / 36 kg bag', yieldCubicFeet: .60, price: 7.6 },
    { id: 'bag-metric', name: '30 kg bag', yieldCubicFeet: .50, price: 7.0 },
  ] as ConcretePackage[],
});

const fence = reactive({
  runs: [{ id: 'run-1', name: 'Back run', length: 60, gates: 1, gateWidth: 4 }] as FenceRun[],
  spacing: 8, railsPerSection: 2, picketWidth: 5.5, picketGap: .5, postPrice: 18, panelPrice: 0, railPrice: 9, picketPrice: 2.2, concreteBagsPerPost: 1.5, concreteBagPrice: 7.6,
});

const paintResult = computed(() => calculatePaint({ ...paint, unit: unit.value }));
const flooringResult = computed(() => calculateFlooring({ ...flooring, unit: unit.value }));
const landscapeResult = computed(() => calculateLandscape({ ...landscape, unit: unit.value }));
const concreteResult = computed(() => calculateConcrete({ ...concrete, unit: unit.value }));
const fenceResult = computed(() => calculateFence({ ...fence, unit: unit.value }));

const areaUnit = computed(() => unit.value === 'metric' ? 'm²' : 'sq ft');
const lengthUnit = computed(() => unit.value === 'metric' ? 'm' : 'ft');
const volumeUnit = computed(() => unit.value === 'metric' ? 'L' : 'gal');
const money = (value: number) => value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
const display = (value: number, places = 2) => round(value, places).toLocaleString(undefined, { maximumFractionDigits: places });

function addRoom() { paint.rooms.push({ id: makeId(), name: `Room ${paint.rooms.length + 1}`, length: 10, width: 10, height: 8, doors: 1, windows: 1, ceiling: false }); }
function addArea(target: 'flooring' | 'landscape') {
  const list = target === 'flooring' ? flooring.areas : landscape.areas;
  list.push({ id: makeId(), name: target === 'flooring' ? `Area ${list.length + 1}` : `Bed ${list.length + 1}`, shape: 'rectangle', length: 10, width: 10, diameter: 0 });
}
function addPour() { concrete.sections.push({ id: makeId(), name: `Pour ${concrete.sections.length + 1}`, shape: 'slab', length: 8, width: 4, depth: .3333, diameter: 1, count: 1, rise: .5833, run: .9167 }); }
function addRun() { fence.runs.push({ id: makeId(), name: `Run ${fence.runs.length + 1}`, length: 24, gates: 0, gateWidth: 4 }); }
function removeAt<T>(list: T[], index: number) { if (list.length > 1) list.splice(index, 1); }

function serializableState() {
  const common = { version: 1, kind: props.kind, unit: unit.value, projectName: projectName.value.slice(0, 80) };
  if (props.kind === 'paint') return { ...common, data: paint };
  if (props.kind === 'flooring-tile') return { ...common, data: flooring };
  if (props.kind === 'landscape-materials') return { ...common, data: landscape };
  if (props.kind === 'concrete') return { ...common, data: concrete };
  return { ...common, data: fence };
}

function applyState(input: unknown): boolean {
  const root = objectValue(input);
  if (root.version !== 1 || root.kind !== props.kind) return false;
  suppressUnitConversion.value = true;
  unit.value = root.unit === 'metric' ? 'metric' : 'imperial';
  projectName.value = cleanName(root.projectName, 'Saved project');
  const data = objectValue(root.data);
  if (props.kind === 'paint') {
    if (Array.isArray(data.rooms)) paint.rooms = data.rooms.slice(0, 20).map((raw, i) => { const item = objectValue(raw); return { id: makeId(), name: cleanName(item.name, `Room ${i + 1}`), length: num(item.length, 10), width: num(item.width, 10), height: num(item.height, 8), doors: num(item.doors, 0, 0, 50), windows: num(item.windows, 0, 0, 100), ceiling: bool(item.ceiling, false) }; });
    for (const key of ['doorArea','windowArea','coats','primerCoats','coverage','primerCoverage','waste','containerSize','containerPrice','primerContainerPrice'] as const) paint[key] = num(data[key], paint[key], 0, key === 'waste' ? 50 : 10000);
  } else if (props.kind === 'flooring-tile') {
    if (Array.isArray(data.areas)) flooring.areas = sanitizeAreas(data.areas, 'Area');
    for (const key of ['pieceLength','pieceWidth','packageCoverage','waste','packagePrice'] as const) flooring[key] = num(data[key], flooring[key], 0, key === 'waste' ? 50 : 100000);
    flooring.pieceUnit = data.pieceUnit === 'cm' ? 'cm' : 'inch';
  } else if (props.kind === 'landscape-materials') {
    if (Array.isArray(data.areas)) landscape.areas = sanitizeAreas(data.areas, 'Bed');
    for (const key of ['depth','waste','bagVolume','bagPrice','bulkPrice'] as const) landscape[key] = num(data[key], landscape[key], 0, key === 'waste' ? 50 : 100000);
    landscape.depthUnit = data.depthUnit === 'cm' ? 'cm' : 'inch';
    landscape.bagVolumeUnit = data.bagVolumeUnit === 'litres' ? 'litres' : 'cubic-feet';
  } else if (props.kind === 'concrete') {
    if (Array.isArray(data.sections)) concrete.sections = data.sections.slice(0, 20).map((raw, i) => { const item = objectValue(raw); const shape = ['slab','footing','post','steps'].includes(String(item.shape)) ? item.shape as ConcreteSection['shape'] : 'slab'; return { id: makeId(), name: cleanName(item.name, `Pour ${i + 1}`), shape, length: num(item.length, 8), width: num(item.width, 4), depth: num(item.depth, .333), diameter: num(item.diameter, 1), count: num(item.count, 1, 1, 1000), rise: num(item.rise, .58), run: num(item.run, .92) }; });
    concrete.waste = num(data.waste, concrete.waste, 0, 50);
    if (Array.isArray(data.packages)) concrete.packages = data.packages.slice(0, 6).map((raw, i) => { const item = objectValue(raw); return { id: `package-${i}`, name: cleanName(item.name, `Package ${i + 1}`), yieldCubicFeet: num(item.yieldCubicFeet, .5, .01, 100), price: num(item.price, 0) }; });
  } else {
    if (Array.isArray(data.runs)) fence.runs = data.runs.slice(0, 30).map((raw, i) => { const item = objectValue(raw); return { id: makeId(), name: cleanName(item.name, `Run ${i + 1}`), length: num(item.length, 20), gates: num(item.gates, 0, 0, 20), gateWidth: num(item.gateWidth, 4) }; });
    for (const key of ['spacing','railsPerSection','picketWidth','picketGap','postPrice','panelPrice','railPrice','picketPrice','concreteBagsPerPost','concreteBagPrice'] as const) fence[key] = num(data[key], fence[key], 0, 100000);
  }
  suppressUnitConversion.value = false;
  return true;
}

function sanitizeAreas(values: unknown[], prefix: string): AreaInput[] {
  return values.slice(0, 20).map((raw, i) => { const item = objectValue(raw); const shape = ['rectangle','circle','triangle'].includes(String(item.shape)) ? item.shape as AreaInput['shape'] : 'rectangle'; return { id: makeId(), name: cleanName(item.name, `${prefix} ${i + 1}`), shape, length: num(item.length, 10), width: num(item.width, 10), diameter: num(item.diameter, 10) }; });
}

function encodeState(state: object): string {
  const bytes = new TextEncoder().encode(JSON.stringify(state));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function decodeState(encoded: string): unknown {
  if (encoded.length > 12_000) throw new Error('Share link is too large.');
  const padded = encoded.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - encoded.length % 4) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const json = new TextDecoder().decode(bytes);
  if (json.length > 24_000) throw new Error('Shared project is too large.');
  return JSON.parse(json) as unknown;
}

function saveProject() {
  try {
    localStorage.setItem(`pql:${props.kind}`, JSON.stringify(serializableState()));
    message.value = 'Saved in this browser.';
  } catch { message.value = 'This browser could not save the project.'; }
}

async function shareProject() {
  try {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('project', encodeState(serializableState()));
    await navigator.clipboard.writeText(url.toString());
    history.replaceState(null, '', url);
    message.value = 'Share link copied. Anyone with it can read these project details.';
  } catch { message.value = 'Could not copy automatically. Copy the address from your browser.'; }
}

function resetProject() {
  localStorage.removeItem(`pql:${props.kind}`);
  window.location.href = window.location.pathname;
}

function revealResults() {
  hasCalculated.value = true;
  message.value = 'Estimate updated below.';
  requestAnimationFrame(() => document.querySelector('#project-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

function printProject() {
  const root = document.documentElement;
  const cleanup = () => root.classList.remove('printing-project');
  root.classList.add('printing-project');
  window.addEventListener('afterprint', cleanup, { once: true });
  window.print();
}

onMounted(() => {
  const shared = new URLSearchParams(window.location.search).get('project');
  try {
    if (shared && applyState(decodeState(shared))) message.value = 'Shared project loaded. Review its assumptions before using it.';
    else {
      const saved = localStorage.getItem(`pql:${props.kind}`);
      if (saved && applyState(JSON.parse(saved) as unknown)) message.value = 'Saved project restored from this browser.';
    }
  } catch { message.value = 'The saved or shared project could not be loaded safely.'; }
});

watch(unit, (value, previous) => {
  if (suppressUnitConversion.value || value === previous) return;
  const lengthFactor = value === 'metric' ? .3048 : 1 / .3048;
  const areaFactor = value === 'metric' ? 1 / 10.7639104167 : 10.7639104167;
  const convert = (value: number, factor: number) => round(value * factor, 4);
  paint.rooms.forEach((room) => { room.length = convert(room.length, lengthFactor); room.width = convert(room.width, lengthFactor); room.height = convert(room.height, lengthFactor); });
  paint.doorArea = convert(paint.doorArea, areaFactor);
  paint.windowArea = convert(paint.windowArea, areaFactor);
  paint.coverage = convert(paint.coverage, value === 'metric' ? 1 / 40.7458 : 40.7458);
  paint.primerCoverage = convert(paint.primerCoverage, value === 'metric' ? 1 / 40.7458 : 40.7458);
  paint.containerSize = convert(paint.containerSize, value === 'metric' ? 3.785411784 : 1 / 3.785411784);
  flooring.areas.forEach((area) => { area.length = convert(area.length, lengthFactor); area.width = convert(area.width, lengthFactor); area.diameter = convert(area.diameter, lengthFactor); });
  flooring.pieceLength = convert(flooring.pieceLength, value === 'metric' ? 2.54 : 1 / 2.54);
  flooring.pieceWidth = convert(flooring.pieceWidth, value === 'metric' ? 2.54 : 1 / 2.54);
  flooring.packageCoverage = convert(flooring.packageCoverage, areaFactor);
  landscape.areas.forEach((area) => { area.length = convert(area.length, lengthFactor); area.width = convert(area.width, lengthFactor); area.diameter = convert(area.diameter, lengthFactor); });
  landscape.depth = convert(landscape.depth, value === 'metric' ? 2.54 : 1 / 2.54);
  landscape.bagVolume = convert(landscape.bagVolume, value === 'metric' ? 28.316846592 : 1 / 28.316846592);
  concrete.sections.forEach((section) => { for (const key of ['length','width','depth','diameter','rise','run'] as const) section[key] = convert(section[key], lengthFactor); });
  fence.runs.forEach((run) => { run.length = convert(run.length, lengthFactor); run.gateWidth = convert(run.gateWidth, lengthFactor); });
  fence.spacing = convert(fence.spacing, lengthFactor);
  fence.picketWidth = convert(fence.picketWidth, value === 'metric' ? 2.54 : 1 / 2.54);
  fence.picketGap = convert(fence.picketGap, value === 'metric' ? 2.54 : 1 / 2.54);
  flooring.pieceUnit = value === 'metric' ? 'cm' : 'inch';
  landscape.depthUnit = value === 'metric' ? 'cm' : 'inch';
  landscape.bagVolumeUnit = value === 'metric' ? 'litres' : 'cubic-feet';
}, { flush: 'sync' });
</script>

<template>
  <section class="planner" :style="{ '--planner-accent': accent }">
    <header class="planner-head print-hidden">
      <div><span class="step-label">PROJECT SETUP</span><h2>Build your estimate</h2><p>Fields update instantly. Use Calculate to review the shopping plan.</p></div>
      <fieldset class="unit-toggle"><legend>Measurement system</legend><label><input v-model="unit" type="radio" value="imperial" /> Imperial</label><label><input v-model="unit" type="radio" value="metric" /> Metric</label></fieldset>
    </header>

    <div class="project-title print-hidden"><label for="project-name">Project name</label><input id="project-name" v-model.trim="projectName" maxlength="80" /></div>

    <div v-if="kind === 'paint'" class="planner-body print-hidden">
      <section class="input-section"><div class="section-title"><div><span>01</span><h3>Rooms and openings</h3></div><button type="button" class="small-button" @click="addRoom">+ Add room</button></div>
        <div class="item-card" v-for="(room, index) in paint.rooms" :key="room.id">
          <div class="item-head"><input v-model.trim="room.name" maxlength="60" aria-label="Room name" /><button type="button" @click="removeAt(paint.rooms, index)" :disabled="paint.rooms.length === 1">Remove</button></div>
          <div class="field-grid"><label>Length <span>{{ lengthUnit }}</span><input v-model.number="room.length" type="number" min="0" max="10000" step="0.01" /></label><label>Width <span>{{ lengthUnit }}</span><input v-model.number="room.width" type="number" min="0" max="10000" step="0.01" /></label><label>Wall height <span>{{ lengthUnit }}</span><input v-model.number="room.height" type="number" min="0" max="1000" step="0.01" /></label><label>Doors <input v-model.number="room.doors" type="number" min="0" max="50" step="1" /></label><label>Windows <input v-model.number="room.windows" type="number" min="0" max="100" step="1" /></label><label class="check-label"><input v-model="room.ceiling" type="checkbox" /> Include ceiling</label></div>
        </div>
        <div class="field-grid compact"><label>Typical door area <span>{{ areaUnit }}</span><input v-model.number="paint.doorArea" type="number" min="0" step="0.01" /></label><label>Typical window area <span>{{ areaUnit }}</span><input v-model.number="paint.windowArea" type="number" min="0" step="0.01" /></label></div>
      </section>
      <section class="input-section"><div class="section-title"><div><span>02</span><h3>Coverage and purchase</h3></div></div><div class="field-grid"><label>Finish coats <input v-model.number="paint.coats" type="number" min="1" max="6" step="1" /></label><label>Primer coats <input v-model.number="paint.primerCoats" type="number" min="0" max="4" step="1" /></label><label>Paint coverage <span>{{ unit === 'metric' ? 'm²/L' : 'sq ft/gal' }}</span><input v-model.number="paint.coverage" type="number" min="1" step="1" /></label><label>Primer coverage <span>{{ unit === 'metric' ? 'm²/L' : 'sq ft/gal' }}</span><input v-model.number="paint.primerCoverage" type="number" min="1" step="1" /></label><label>Waste allowance <span>%</span><input v-model.number="paint.waste" type="number" min="0" max="50" step="1" /></label><label>Container size <span>{{ volumeUnit }}</span><input v-model.number="paint.containerSize" type="number" min="0.01" step="0.01" /></label><label>Paint price / container <span>$</span><input v-model.number="paint.containerPrice" type="number" min="0" step="0.01" /></label><label>Primer price / container <span>$</span><input v-model.number="paint.primerContainerPrice" type="number" min="0" step="0.01" /></label></div></section>
    </div>

    <div v-else-if="kind === 'flooring-tile'" class="planner-body print-hidden">
      <section class="input-section"><div class="section-title"><div><span>01</span><h3>Floor areas</h3></div><button type="button" class="small-button" @click="addArea('flooring')">+ Add area</button></div><div class="item-card" v-for="(area, index) in flooring.areas" :key="area.id"><div class="item-head"><input v-model.trim="area.name" maxlength="60" aria-label="Area name" /><button type="button" @click="removeAt(flooring.areas, index)" :disabled="flooring.areas.length === 1">Remove</button></div><div class="field-grid"><label>Shape <select v-model="area.shape"><option value="rectangle">Rectangle</option><option value="triangle">Triangle</option><option value="circle">Circle</option></select></label><template v-if="area.shape === 'circle'"><label>Diameter <span>{{ lengthUnit }}</span><input v-model.number="area.diameter" type="number" min="0" step=".01" /></label></template><template v-else><label>{{ area.shape === 'triangle' ? 'Base' : 'Length' }} <span>{{ lengthUnit }}</span><input v-model.number="area.length" type="number" min="0" step=".01" /></label><label>{{ area.shape === 'triangle' ? 'Height' : 'Width' }} <span>{{ lengthUnit }}</span><input v-model.number="area.width" type="number" min="0" step=".01" /></label></template></div></div></section>
      <section class="input-section"><div class="section-title"><div><span>02</span><h3>Tile, plank, or package</h3></div></div><div class="field-grid"><label>Piece length <span>{{ flooring.pieceUnit }}</span><input v-model.number="flooring.pieceLength" type="number" min="0" step=".01" /></label><label>Piece width <span>{{ flooring.pieceUnit }}</span><input v-model.number="flooring.pieceWidth" type="number" min="0" step=".01" /></label><label>Coverage / package <span>{{ areaUnit }}</span><input v-model.number="flooring.packageCoverage" type="number" min=".01" step=".01" /></label><label>Pattern + waste <span>%</span><input v-model.number="flooring.waste" type="number" min="0" max="50" step="1" /></label><label>Price / package <span>$</span><input v-model.number="flooring.packagePrice" type="number" min="0" step=".01" /></label></div></section>
    </div>

    <div v-else-if="kind === 'landscape-materials'" class="planner-body print-hidden">
      <section class="input-section"><div class="section-title"><div><span>01</span><h3>Beds and areas</h3></div><button type="button" class="small-button" @click="addArea('landscape')">+ Add bed</button></div><div class="item-card" v-for="(area, index) in landscape.areas" :key="area.id"><div class="item-head"><input v-model.trim="area.name" maxlength="60" aria-label="Bed name" /><button type="button" @click="removeAt(landscape.areas, index)" :disabled="landscape.areas.length === 1">Remove</button></div><div class="field-grid"><label>Shape <select v-model="area.shape"><option value="rectangle">Rectangle</option><option value="triangle">Triangle</option><option value="circle">Circle</option></select></label><template v-if="area.shape === 'circle'"><label>Diameter <span>{{ lengthUnit }}</span><input v-model.number="area.diameter" type="number" min="0" step=".01" /></label></template><template v-else><label>{{ area.shape === 'triangle' ? 'Base' : 'Length' }} <span>{{ lengthUnit }}</span><input v-model.number="area.length" type="number" min="0" step=".01" /></label><label>{{ area.shape === 'triangle' ? 'Height' : 'Width' }} <span>{{ lengthUnit }}</span><input v-model.number="area.width" type="number" min="0" step=".01" /></label></template></div></div></section>
      <section class="input-section"><div class="section-title"><div><span>02</span><h3>Depth and package comparison</h3></div></div><div class="field-grid"><label>Installed depth <span>{{ landscape.depthUnit }}</span><input v-model.number="landscape.depth" type="number" min="0" step=".1" /></label><label>Settling + waste <span>%</span><input v-model.number="landscape.waste" type="number" min="0" max="50" step="1" /></label><label>Bag volume <span>{{ landscape.bagVolumeUnit === 'litres' ? 'L' : 'cu ft' }}</span><input v-model.number="landscape.bagVolume" type="number" min=".01" step=".01" /></label><label>Price / bag <span>$</span><input v-model.number="landscape.bagPrice" type="number" min="0" step=".01" /></label><label>Bulk price / {{ unit === 'metric' ? 'm³' : 'yd³' }} <span>$</span><input v-model.number="landscape.bulkPrice" type="number" min="0" step=".01" /></label></div></section>
    </div>

    <div v-else-if="kind === 'concrete'" class="planner-body print-hidden">
      <section class="input-section"><div class="section-title"><div><span>01</span><h3>Pours and shapes</h3></div><button type="button" class="small-button" @click="addPour">+ Add pour</button></div><div class="item-card" v-for="(section, index) in concrete.sections" :key="section.id"><div class="item-head"><input v-model.trim="section.name" maxlength="60" aria-label="Pour name" /><button type="button" @click="removeAt(concrete.sections, index)" :disabled="concrete.sections.length === 1">Remove</button></div><div class="field-grid"><label>Shape <select v-model="section.shape"><option value="slab">Slab</option><option value="footing">Footing</option><option value="post">Round post hole</option><option value="steps">Steps</option></select></label><template v-if="section.shape === 'post'"><label>Diameter <span>{{ lengthUnit }}</span><input v-model.number="section.diameter" type="number" min="0" step=".01" /></label><label>Depth <span>{{ lengthUnit }}</span><input v-model.number="section.depth" type="number" min="0" step=".01" /></label><label>Hole count <input v-model.number="section.count" type="number" min="1" step="1" /></label></template><template v-else-if="section.shape === 'steps'"><label>Step width <span>{{ lengthUnit }}</span><input v-model.number="section.width" type="number" min="0" step=".01" /></label><label>Rise <span>{{ lengthUnit }}</span><input v-model.number="section.rise" type="number" min="0" step=".01" /></label><label>Run <span>{{ lengthUnit }}</span><input v-model.number="section.run" type="number" min="0" step=".01" /></label><label>Steps <input v-model.number="section.count" type="number" min="1" step="1" /></label></template><template v-else><label>Length <span>{{ lengthUnit }}</span><input v-model.number="section.length" type="number" min="0" step=".01" /></label><label>Width <span>{{ lengthUnit }}</span><input v-model.number="section.width" type="number" min="0" step=".01" /></label><label>Depth <span>{{ lengthUnit }}</span><input v-model.number="section.depth" type="number" min="0" step=".001" /></label><label>Count <input v-model.number="section.count" type="number" min="1" step="1" /></label></template></div></div></section>
      <section class="input-section"><div class="section-title"><div><span>02</span><h3>Bag yield comparison</h3></div></div><div class="field-grid compact"><label>Contingency <span>%</span><input v-model.number="concrete.waste" type="number" min="0" max="50" step="1" /></label></div><div class="package-table"><div class="package-row package-head"><span>Package</span><span>Yield (cu ft)</span><span>Price</span></div><div class="package-row" v-for="item in concrete.packages" :key="item.id"><input v-model.trim="item.name" maxlength="60" aria-label="Package name" /><input v-model.number="item.yieldCubicFeet" type="number" min=".01" step=".01" aria-label="Package yield in cubic feet" /><input v-model.number="item.price" type="number" min="0" step=".01" aria-label="Package price" /></div></div></section>
    </div>

    <div v-else class="planner-body print-hidden">
      <section class="input-section"><div class="section-title"><div><span>01</span><h3>Fence runs and gates</h3></div><button type="button" class="small-button" @click="addRun">+ Add run</button></div><div class="item-card" v-for="(run, index) in fence.runs" :key="run.id"><div class="item-head"><input v-model.trim="run.name" maxlength="60" aria-label="Fence run name" /><button type="button" @click="removeAt(fence.runs, index)" :disabled="fence.runs.length === 1">Remove</button></div><div class="field-grid"><label>Run length <span>{{ lengthUnit }}</span><input v-model.number="run.length" type="number" min="0" step=".01" /></label><label>Gates <input v-model.number="run.gates" type="number" min="0" max="20" step="1" /></label><label>Each gate width <span>{{ lengthUnit }}</span><input v-model.number="run.gateWidth" type="number" min="0" step=".01" /></label></div></div></section>
      <section class="input-section"><div class="section-title"><div><span>02</span><h3>Layout and local prices</h3></div></div><div class="field-grid"><label>Target post / panel spacing <span>{{ lengthUnit }}</span><input v-model.number="fence.spacing" type="number" min=".01" step=".01" /></label><label>Rails / section <input v-model.number="fence.railsPerSection" type="number" min="0" max="10" step="1" /></label><label>Picket width <span>{{ unit === 'metric' ? 'cm' : 'in' }}</span><input v-model.number="fence.picketWidth" type="number" min="0" step=".01" /></label><label>Picket gap <span>{{ unit === 'metric' ? 'cm' : 'in' }}</span><input v-model.number="fence.picketGap" type="number" min="0" step=".01" /></label><label>Post price <span>$</span><input v-model.number="fence.postPrice" type="number" min="0" step=".01" /></label><label>Panel price <span>$</span><input v-model.number="fence.panelPrice" type="number" min="0" step=".01" /></label><label>Rail price <span>$</span><input v-model.number="fence.railPrice" type="number" min="0" step=".01" /></label><label>Picket price <span>$</span><input v-model.number="fence.picketPrice" type="number" min="0" step=".01" /></label><label>Concrete bags / post <input v-model.number="fence.concreteBagsPerPost" type="number" min="0" step=".1" /></label><label>Concrete price / bag <span>$</span><input v-model.number="fence.concreteBagPrice" type="number" min="0" step=".01" /></label></div></section>
    </div>

    <CalculationVisual
      :kind="kind"
      :unit="unit"
      :accent="accent"
      :paint-rooms="paint.rooms"
      :areas="kind === 'flooring-tile' ? flooring.areas : kind === 'landscape-materials' ? landscape.areas : undefined"
      :landscape-depth="landscape.depth"
      :landscape-depth-unit="landscape.depthUnit"
      :concrete-sections="concrete.sections"
      :fence-runs="fence.runs"
      :fence-spacing="fence.spacing"
    />

    <div class="planner-actions print-hidden"><button class="calculate-button" type="button" @click="revealResults">Calculate project <span>→</span></button><button type="button" @click="saveProject">Save locally</button><button type="button" @click="shareProject">Copy share link</button><button type="button" @click="resetProject">Reset</button><p aria-live="polite">{{ message }}</p></div>

    <section v-show="hasCalculated" id="project-results" class="results" aria-labelledby="results-title">
      <div class="print-sheet-brand print-only" aria-label="Project Quantity Lab">
        <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 12h32v26H8z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M14 31 22 18l6 9 6-11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14" cy="12" r="4" fill="currentColor"/></svg>
        <span><strong>Project Quantity</strong><small>LAB</small></span>
      </div>
      <div class="result-head"><div><span class="step-label">PROJECT PLAN</span><h2 id="results-title">{{ projectName }}</h2><p>Planning estimate: confirm package coverage and local requirements before purchasing.</p></div><button class="print-button print-hidden" type="button" @click="printProject">Print / Save PDF</button></div>
      <section class="print-inputs print-only" aria-labelledby="print-inputs-title">
        <h3 id="print-inputs-title">Project inputs</h3>
        <p class="print-unit"><strong>Measurement system:</strong> {{ unit === 'metric' ? 'Metric' : 'Imperial' }}</p>
        <template v-if="kind === 'paint'">
          <table><thead><tr><th>Room</th><th>Dimensions</th><th>Openings</th><th>Ceiling</th></tr></thead><tbody><tr v-for="room in paint.rooms" :key="room.id"><td>{{ room.name }}</td><td>{{ display(room.length) }} x {{ display(room.width) }} x {{ display(room.height) }} {{ lengthUnit }}</td><td>{{ room.doors }} door(s), {{ room.windows }} window(s)</td><td>{{ room.ceiling ? 'Included' : 'Not included' }}</td></tr></tbody></table>
          <div class="print-settings"><span><strong>Door area</strong>{{ display(paint.doorArea) }} {{ areaUnit }}</span><span><strong>Window area</strong>{{ display(paint.windowArea) }} {{ areaUnit }}</span><span><strong>Finish coats</strong>{{ paint.coats }}</span><span><strong>Primer coats</strong>{{ paint.primerCoats }}</span><span><strong>Paint coverage</strong>{{ display(paint.coverage) }} {{ unit === 'metric' ? 'm²/L' : 'sq ft/gal' }}</span><span><strong>Primer coverage</strong>{{ display(paint.primerCoverage) }} {{ unit === 'metric' ? 'm²/L' : 'sq ft/gal' }}</span><span><strong>Waste</strong>{{ paint.waste }}%</span><span><strong>Container</strong>{{ display(paint.containerSize) }} {{ volumeUnit }} at {{ money(paint.containerPrice) }}</span></div>
        </template>
        <template v-else-if="kind === 'flooring-tile'">
          <table><thead><tr><th>Area</th><th>Shape</th><th>Measurements</th></tr></thead><tbody><tr v-for="area in flooring.areas" :key="area.id"><td>{{ area.name }}</td><td>{{ area.shape }}</td><td>{{ area.shape === 'circle' ? `Diameter ${display(area.diameter)}` : `${display(area.length)} x ${display(area.width)}` }} {{ lengthUnit }}</td></tr></tbody></table>
          <div class="print-settings"><span><strong>Piece size</strong>{{ display(flooring.pieceLength) }} x {{ display(flooring.pieceWidth) }} {{ flooring.pieceUnit }}</span><span><strong>Package coverage</strong>{{ display(flooring.packageCoverage) }} {{ areaUnit }}</span><span><strong>Pattern and waste</strong>{{ flooring.waste }}%</span><span><strong>Package price</strong>{{ money(flooring.packagePrice) }}</span></div>
        </template>
        <template v-else-if="kind === 'landscape-materials'">
          <table><thead><tr><th>Bed</th><th>Shape</th><th>Measurements</th></tr></thead><tbody><tr v-for="area in landscape.areas" :key="area.id"><td>{{ area.name }}</td><td>{{ area.shape }}</td><td>{{ area.shape === 'circle' ? `Diameter ${display(area.diameter)}` : `${display(area.length)} x ${display(area.width)}` }} {{ lengthUnit }}</td></tr></tbody></table>
          <div class="print-settings"><span><strong>Installed depth</strong>{{ display(landscape.depth) }} {{ landscape.depthUnit }}</span><span><strong>Settling and waste</strong>{{ landscape.waste }}%</span><span><strong>Bag volume</strong>{{ display(landscape.bagVolume) }} {{ landscape.bagVolumeUnit === 'litres' ? 'L' : 'cu ft' }}</span><span><strong>Bag price</strong>{{ money(landscape.bagPrice) }}</span><span><strong>Bulk price</strong>{{ money(landscape.bulkPrice) }} / {{ unit === 'metric' ? 'm³' : 'yd³' }}</span></div>
        </template>
        <template v-else-if="kind === 'concrete'">
          <table><thead><tr><th>Pour</th><th>Shape</th><th>Measurements</th></tr></thead><tbody><tr v-for="section in concrete.sections" :key="section.id"><td>{{ section.name }}</td><td>{{ section.shape }}</td><td><template v-if="section.shape === 'post'">Diameter {{ display(section.diameter) }}, depth {{ display(section.depth) }}, count {{ section.count }}</template><template v-else-if="section.shape === 'steps'">{{ display(section.width) }} wide, {{ display(section.rise) }} rise, {{ display(section.run) }} run, {{ section.count }} steps</template><template v-else>{{ display(section.length) }} x {{ display(section.width) }} x {{ display(section.depth) }}, count {{ section.count }}</template> {{ lengthUnit }}</td></tr></tbody></table>
          <div class="print-settings"><span><strong>Contingency</strong>{{ concrete.waste }}%</span><span v-for="item in concrete.packages" :key="item.id"><strong>{{ item.name }}</strong>{{ display(item.yieldCubicFeet) }} cu ft yield at {{ money(item.price) }}</span></div>
        </template>
        <template v-else>
          <table><thead><tr><th>Run</th><th>Length</th><th>Gates</th></tr></thead><tbody><tr v-for="run in fence.runs" :key="run.id"><td>{{ run.name }}</td><td>{{ display(run.length) }} {{ lengthUnit }}</td><td>{{ run.gates }} at {{ display(run.gateWidth) }} {{ lengthUnit }}</td></tr></tbody></table>
          <div class="print-settings"><span><strong>Spacing</strong>{{ display(fence.spacing) }} {{ lengthUnit }}</span><span><strong>Rails per section</strong>{{ fence.railsPerSection }}</span><span><strong>Picket and gap</strong>{{ display(fence.picketWidth) }} + {{ display(fence.picketGap) }} {{ unit === 'metric' ? 'cm' : 'in' }}</span><span><strong>Post price</strong>{{ money(fence.postPrice) }}</span><span><strong>Panel price</strong>{{ money(fence.panelPrice) }}</span><span><strong>Rail price</strong>{{ money(fence.railPrice) }}</span><span><strong>Picket price</strong>{{ money(fence.picketPrice) }}</span><span><strong>Concrete</strong>{{ display(fence.concreteBagsPerPost) }} bag(s) per post at {{ money(fence.concreteBagPrice) }}</span></div>
        </template>
      </section>
      <template v-if="kind === 'paint'"><div class="result-metrics"><div><span>Paintable area</span><strong>{{ display(paintResult.netArea) }}</strong><small>{{ areaUnit }}</small></div><div><span>Finish paint</span><strong>{{ paintResult.paint.packages }}</strong><small>containers · {{ display(paintResult.paint.exact) }} {{ volumeUnit }}</small></div><div><span>Primer</span><strong>{{ paintResult.primer.packages }}</strong><small>containers · {{ display(paintResult.primer.exact) }} {{ volumeUnit }}</small></div><div><span>Estimated material</span><strong>{{ money(paintResult.paint.cost + paintResult.primer.cost) }}</strong><small>paint + primer</small></div></div><div class="result-detail"><h3>Area audit</h3><p>Walls {{ display(paintResult.wallArea) }} + ceilings {{ display(paintResult.ceilingArea) }} − openings {{ display(paintResult.openingsArea) }} = {{ display(paintResult.netArea) }} {{ areaUnit }}.</p><h3>Shopping list</h3><ul><li>{{ paintResult.paint.packages }} finish-paint container(s)</li><li v-if="paintResult.primer.packages">{{ paintResult.primer.packages }} primer container(s)</li><li>Roller frame, sleeves, tray, angled brush, tape, drop cloths, patching and sanding supplies</li></ul></div></template>
      <template v-else-if="kind === 'flooring-tile'"><div class="result-metrics"><div><span>Measured area</span><strong>{{ display(flooringResult.area) }}</strong><small>{{ areaUnit }}</small></div><div><span>With waste</span><strong>{{ display(flooringResult.purchaseArea) }}</strong><small>{{ areaUnit }}</small></div><div><span>Pieces</span><strong>{{ flooringResult.pieces }}</strong><small>rounded up</small></div><div><span>Packages / cost</span><strong>{{ flooringResult.packages }}</strong><small>{{ money(flooringResult.cost) }}</small></div></div><div class="result-detail"><h3>Shopping list</h3><ul><li>{{ flooringResult.packages }} flooring or tile package(s), about {{ flooringResult.pieces }} pieces</li><li>Underlayment or membrane as specified</li><li>Transitions, trim, adhesive or mortar, grout where applicable, spacers and cutting supplies</li></ul></div></template>
      <template v-else-if="kind === 'landscape-materials'"><div class="result-metrics"><div><span>Bed area</span><strong>{{ display(landscapeResult.area) }}</strong><small>{{ areaUnit }}</small></div><div><span>Volume</span><strong>{{ display(unit === 'metric' ? landscapeResult.cubicMetres : landscapeResult.cubicYards) }}</strong><small>{{ unit === 'metric' ? 'm³' : 'yd³' }}</small></div><div><span>Bag option</span><strong>{{ landscapeResult.bags }}</strong><small>{{ money(landscapeResult.bagCost) }}</small></div><div><span>Bulk option</span><strong>{{ display(landscapeResult.bulkUnits) }}</strong><small>{{ unit === 'metric' ? 'm³' : 'yd³' }} · {{ money(landscapeResult.bulkCost) }}</small></div></div><div class="result-detail"><h3>Package comparison</h3><p v-if="landscape.bagPrice && landscape.bulkPrice">At the entered prices, <strong>{{ landscapeResult.cheapest === 'equal' ? 'both options cost the same' : `${landscapeResult.cheapest} are cheaper` }}</strong> before delivery fees, minimums, deposits, and handling.</p><h3>Shopping list</h3><ul><li>{{ landscapeResult.bags }} bag(s), or {{ display(landscapeResult.bulkUnits) }} {{ unit === 'metric' ? 'cubic metres' : 'cubic yards' }} bulk</li><li>Landscape fabric only where appropriate, edging, rake, shovel, wheelbarrow, gloves</li></ul></div></template>
      <template v-else-if="kind === 'concrete'"><div class="result-metrics"><div><span>Measured volume</span><strong>{{ display(concreteResult.rawCubicFeet) }}</strong><small>cu ft</small></div><div><span>With contingency</span><strong>{{ display(concreteResult.purchaseCubicFeet) }}</strong><small>cu ft</small></div><div><span>Ready-mix volume</span><strong>{{ display(unit === 'metric' ? concreteResult.cubicMetres : concreteResult.cubicYards) }}</strong><small>{{ unit === 'metric' ? 'm³' : 'yd³' }}</small></div><div><span>Best entered bag cost</span><strong>{{ money(Math.min(...concreteResult.packageResults.filter(p => p.price > 0).map(p => p.cost))) }}</strong><small>confirm delivery alternative</small></div></div><div class="result-detail"><h3>Which package is cheaper?</h3><div class="comparison-table"><div v-for="item in concreteResult.packageResults" :key="item.id" :class="{ best: item.id === concreteResult.cheapestPackageId }"><span>{{ item.name }}</span><strong>{{ item.bags }} bags</strong><span>{{ money(item.cost) }}</span><small v-if="item.id === concreteResult.cheapestPackageId">Lowest entered bag cost</small></div></div><h3>Shopping list</h3><ul><li>Selected concrete bags or a confirmed ready-mix order</li><li>Forms, stakes, release agent, reinforcement as designed, mixing/placement tools, finishing and curing supplies</li></ul></div></template>
      <template v-else><div class="result-metrics"><div><span>Net fence length</span><strong>{{ display(fenceResult.netLength) }}</strong><small>{{ lengthUnit }}</small></div><div><span>Sections / panels</span><strong>{{ fenceResult.sections }}</strong><small>{{ fenceResult.rails }} rails</small></div><div><span>Posts</span><strong>{{ fenceResult.totalPosts }}</strong><small>{{ fenceResult.gatePosts }} dedicated gate posts</small></div><div><span>Estimated material</span><strong>{{ money(fenceResult.cost) }}</strong><small>entered items only</small></div></div><div class="result-detail"><h3>Shopping list</h3><ul><li>{{ fenceResult.totalPosts }} posts ({{ fenceResult.gatePosts }} for gates)</li><li>{{ fenceResult.sections }} panels/sections, {{ fenceResult.rails }} rails, {{ fenceResult.pickets }} pickets</li><li>{{ fenceResult.concreteBags }} concrete bags, plus caps, fasteners, gate hardware, string line and layout stakes</li></ul></div></template>
      <div class="result-foot"><strong>Project Quantity Lab</strong><span>Saved from {{ typeof location !== 'undefined' ? location.host : 'project-quantity-lab.workers.dev' }}</span></div>
    </section>
  </section>
</template>

<style scoped>
.planner { --planner-accent: #f06d3a; border: 1px solid var(--line); border-radius: 24px; background: var(--white); box-shadow: var(--shadow); overflow: hidden; }
.print-only { display: none; }
.planner-head { display: flex; justify-content: space-between; gap: 2rem; padding: 2rem; background: #182820; color: white; }
.planner-head h2, .result-head h2 { margin: .3rem 0; font-size: clamp(1.8rem, 4vw, 2.8rem); }
.planner-head p, .result-head p { margin: 0; color: #bdcbc3; }
.step-label { color: var(--planner-accent); font: 900 .7rem/1 ui-monospace, monospace; letter-spacing: .12em; }
.unit-toggle { display: flex; align-items: center; align-self: center; gap: .25rem; margin: 0; padding: .25rem; border: 1px solid #ffffff33; border-radius: 999px; }
.unit-toggle legend { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.unit-toggle label { cursor: pointer; padding: .48rem .7rem; border-radius: 999px; font-weight: 800; font-size: .82rem; }
.unit-toggle label:has(input:checked) { background: white; color: #17231f; }
.unit-toggle input { position: absolute; opacity: 0; }
.project-title { display: grid; grid-template-columns: 145px 1fr; align-items: center; padding: 1.15rem 2rem; border-bottom: 1px solid var(--line); }
.project-title label { font-weight: 850; }
.project-title input { border: 0; border-bottom: 1px solid var(--line); background: transparent; padding: .55rem; font-weight: 700; }
.planner-body { padding: 2rem; display: grid; gap: 2.5rem; }
.input-section { display: grid; gap: 1rem; }
.section-title { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.section-title > div { display: flex; align-items: center; gap: .75rem; }
.section-title span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 50%; background: var(--planner-accent); color: white; font: 900 .7rem/1 ui-monospace, monospace; }
.section-title h3 { margin: 0; }
.small-button, .item-head button { border: 0; background: transparent; color: #315a48; font-weight: 850; cursor: pointer; }
.small-button { padding: .5rem .8rem; border: 1px solid #b8c8c0; border-radius: 999px; }
.item-card { padding: 1rem; border: 1px solid var(--line); border-radius: 14px; background: #fbf8f1; }
.item-head { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: .85rem; }
.item-head input { min-width: 0; max-width: 340px; border: 0; border-bottom: 1px solid var(--line); background: transparent; font-weight: 850; }
.item-head button:disabled { opacity: .35; cursor: not-allowed; }
.field-grid { display: grid; grid-template-columns: repeat(4, minmax(120px, 1fr)); gap: .8rem; }
.field-grid.compact { grid-template-columns: repeat(2, minmax(140px, 260px)); }
.field-grid label { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: .2rem; color: #4f5a54; font-size: .76rem; font-weight: 850; }
.field-grid label > span { color: #7a817c; font-size: .68rem; }
.field-grid input, .field-grid select, .package-row input { grid-column: 1 / -1; width: 100%; min-width: 0; border: 1px solid #cfc6b7; border-radius: 8px; background: white; color: var(--ink); padding: .62rem .7rem; }
.field-grid input:focus, .field-grid select:focus { border-color: var(--planner-accent); }
.field-grid .check-label { display: flex; align-items: center; align-self: end; min-height: 43px; border: 1px solid #cfc6b7; border-radius: 8px; background: white; padding: .62rem .7rem; }
.field-grid .check-label input { grid-column: auto; width: 18px; height: 18px; accent-color: var(--planner-accent); }
.package-table { overflow-x: auto; border: 1px solid var(--line); border-radius: 12px; }
.package-row { min-width: 560px; display: grid; grid-template-columns: 1.5fr .75fr .75fr; gap: .7rem; padding: .7rem; border-top: 1px solid var(--line); }
.package-row:first-child { border-top: 0; }
.package-head { background: #ede6da; font-size: .72rem; font-weight: 850; text-transform: uppercase; letter-spacing: .05em; }
.planner-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .65rem; padding: 1.3rem 2rem; border-top: 1px solid var(--line); background: #f1ebdf; }
.planner-actions button { min-height: 42px; padding: .55rem .8rem; border: 1px solid #afa697; border-radius: 999px; background: transparent; font-weight: 800; cursor: pointer; }
.planner-actions .calculate-button { min-height: 48px; padding-inline: 1.2rem; border-color: #17231f; background: #17231f; color: white; }
.calculate-button span { margin-left: .6rem; }
.planner-actions p { flex: 1 0 100%; margin: .2rem 0 0; color: #5f685f; font-size: .8rem; }
.results { scroll-margin-top: 100px; padding: 2rem; background: #fffdfa; border-top: 5px solid var(--planner-accent); }
.result-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; padding-bottom: 1.6rem; border-bottom: 2px solid #17231f; }
.result-head p { color: #5f685f; }
.print-button { padding: .6rem 1rem; border: 1px solid #17231f; border-radius: 999px; background: white; font-weight: 800; cursor: pointer; }
.result-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin: 1.5rem 0; background: var(--line); border: 1px solid var(--line); }
.result-metrics > div { min-width: 0; padding: 1.2rem; background: #f5f0e6; }
.result-metrics span, .result-metrics small { display: block; color: #667068; font-size: .72rem; font-weight: 750; }
.result-metrics strong { display: block; margin: .3rem 0; font-size: clamp(1.35rem, 3vw, 2rem); letter-spacing: -.04em; overflow-wrap: anywhere; }
.result-detail { display: grid; grid-template-columns: minmax(150px, .4fr) 1fr; gap: .5rem 2rem; padding-block: 1rem; }
.result-detail h3 { margin: .4rem 0; }
.result-detail p, .result-detail ul, .comparison-table { margin: .4rem 0 1rem; }
.result-detail ul { padding-left: 1.1rem; }
.comparison-table { display: grid; gap: .4rem; }
.comparison-table > div { display: grid; grid-template-columns: 1.5fr .7fr .7fr; gap: .5rem; align-items: center; padding: .7rem; border: 1px solid var(--line); border-radius: 8px; }
.comparison-table > div.best { border-color: var(--planner-accent); background: color-mix(in srgb, var(--planner-accent) 9%, white); }
.comparison-table small { grid-column: 1 / -1; color: #315a48; font-weight: 850; }
.result-foot { display: flex; justify-content: space-between; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--line); color: #687169; font-size: .72rem; }

@media (max-width: 850px) {
  .field-grid { grid-template-columns: repeat(2, 1fr); }
  .result-metrics { grid-template-columns: repeat(2, 1fr); }
  .result-detail { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .planner { border-radius: 16px; }
  .planner-head { flex-direction: column; padding: 1.2rem; }
  .unit-toggle { align-self: flex-start; }
  .project-title { grid-template-columns: 1fr; padding: 1rem 1.2rem; }
  .planner-body, .results { padding: 1.2rem; }
  .field-grid, .field-grid.compact { grid-template-columns: 1fr; }
  .section-title { align-items: flex-start; }
  .result-head { flex-direction: column; }
  .result-metrics { grid-template-columns: 1fr 1fr; }
  .comparison-table > div { grid-template-columns: 1fr; }
  .result-foot { flex-direction: column; }
}
@media print {
  .print-only { display: block !important; }
  .planner { border: 0; box-shadow: none; }
  .results { display: block !important; padding: 0; border-top: 0; background: white; }
  .print-sheet-brand { display: flex !important; align-items: center; gap: .55rem; padding-bottom: .8rem; border-bottom: 1px solid #777; }
  .print-sheet-brand svg { width: 34px; height: 34px; color: #17231f; }
  .print-sheet-brand span { display: flex; align-items: baseline; gap: .3rem; line-height: 1; }
  .print-sheet-brand strong { font-size: 12pt; }
  .print-sheet-brand small { color: #174e3b; font-size: 7pt; font-weight: 900; letter-spacing: .12em; }
  .result-head { padding: 5mm 0 3mm; gap: 8mm; }
  .result-head h2 { font-size: 22pt; }
  .result-head p { color: #333; font-size: 8.5pt; }
  .print-inputs { padding: 4mm 0 2mm; break-inside: avoid; }
  .print-inputs h3 { margin: 0 0 1mm; font-size: 12pt; }
  .print-unit { margin: 0 0 2mm; font-size: 8pt; }
  .print-inputs table { width: 100%; border-collapse: collapse; font-size: 7.5pt; }
  .print-inputs th, .print-inputs td { padding: 1.5mm 2mm; border: 1px solid #aaa; text-align: left; vertical-align: top; }
  .print-inputs th { background: #eee; }
  .print-settings { display: grid !important; grid-template-columns: repeat(4, 1fr); gap: 1px; margin-top: 2mm; border: 1px solid #aaa; background: #aaa; }
  .print-settings span { display: grid; padding: 1.5mm 2mm; background: white; font-size: 7.2pt; }
  .print-settings strong { font-size: 6.5pt; text-transform: uppercase; letter-spacing: .04em; }
  .result-metrics { break-inside: avoid; }
  .result-detail { break-inside: avoid; }
  .result-metrics { margin: 3mm 0; }
  .result-metrics > div { padding: 3mm; }
  .result-metrics strong { font-size: 15pt; }
  .result-detail { padding-block: 2mm; font-size: 8.5pt; }
  .result-detail h3 { font-size: 10pt; }
  .result-foot { margin-top: 3mm; padding-top: 2mm; }
  .result-foot { padding-inline: 2mm; }
  .result-foot span { display: none; }
}
</style>

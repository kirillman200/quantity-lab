<script setup lang="ts">
import { computed } from 'vue';
import type { AreaInput, ConcreteSection, FenceRun, PaintRoom, UnitSystem } from '../lib/calculations';
import type { CalculatorSlug } from '../data/site';

const props = defineProps<{
  kind: CalculatorSlug;
  unit: UnitSystem;
  accent: string;
  paintRooms?: PaintRoom[];
  areas?: AreaInput[];
  landscapeDepth?: number;
  landscapeDepthUnit?: 'inch' | 'cm';
  concreteSections?: ConcreteSection[];
  fenceRuns?: FenceRun[];
  fenceSpacing?: number;
}>();

const lengthUnit = computed(() => props.unit === 'metric' ? 'm' : 'ft');
const visualTitle = computed(() => ({
  paint: 'Live room surface preview',
  'flooring-tile': 'Live floor area preview',
  'landscape-materials': 'Live bed and depth preview',
  concrete: 'Live concrete shape preview',
  fence: 'Live fence run preview',
}[props.kind]));

const visibleRooms = computed(() => (props.paintRooms ?? []).slice(0, 4));
const visibleAreas = computed(() => (props.areas ?? []).slice(0, 6));
const visibleSections = computed(() => (props.concreteSections ?? []).slice(0, 6));
const visibleRuns = computed(() => (props.fenceRuns ?? []).slice(0, 5));

const format = (value: number, places = 2) => Number.isFinite(value)
  ? value.toLocaleString(undefined, { maximumFractionDigits: places })
  : '0';

function roomAspect(room: PaintRoom) {
  const ratio = room.height > 0 ? room.length / room.height : 1.5;
  return { aspectRatio: `${Math.min(2.2, Math.max(.9, ratio))} / 1` };
}

function areaLabel(area: AreaInput) {
  if (area.shape === 'circle') return `Diameter ${format(area.diameter)} ${lengthUnit.value}`;
  const first = area.shape === 'triangle' ? 'base' : 'length';
  const second = area.shape === 'triangle' ? 'height' : 'width';
  return `${first} ${format(area.length)} ${lengthUnit.value}, ${second} ${format(area.width)} ${lengthUnit.value}`;
}

function sectionLabel(section: ConcreteSection) {
  if (section.shape === 'post') return `${format(section.diameter)} ${lengthUnit.value} diameter, ${format(section.depth)} ${lengthUnit.value} deep, ${format(section.count, 0)} total`;
  if (section.shape === 'steps') return `${format(section.width)} ${lengthUnit.value} wide, ${format(section.rise)} ${lengthUnit.value} rise, ${format(section.run)} ${lengthUnit.value} run, ${format(section.count, 0)} steps`;
  return `${format(section.length)} x ${format(section.width)} x ${format(section.depth)} ${lengthUnit.value}, ${format(section.count, 0)} total`;
}

function runSections(run: FenceRun) {
  const gateLength = Math.max(0, run.gates) * Math.max(0, run.gateWidth);
  const net = Math.max(0, run.length - gateLength);
  return props.fenceSpacing && props.fenceSpacing > 0 ? Math.ceil(net / props.fenceSpacing) : 0;
}

function postMarkers(run: FenceRun) {
  return Array.from({ length: Math.min(9, Math.max(2, runSections(run) + 1)) });
}
</script>

<template>
  <figure class="calculation-visual print-hidden" :style="{ '--visual-accent': accent }" aria-labelledby="calculation-visual-title">
    <figcaption>
      <span>LIVE MEASUREMENT VIEW</span>
      <div><h3 id="calculation-visual-title">{{ visualTitle }}</h3><p>Changes here follow the measurements above. The drawing is explanatory and not to scale.</p></div>
    </figcaption>

    <div v-if="kind === 'paint'" class="visual-grid room-grid">
      <article v-for="room in visibleRooms" :key="room.id" class="visual-card">
        <div class="room-shape" :style="roomAspect(room)">
          <span v-if="room.doors" class="room-door"></span>
          <span v-if="room.windows" class="room-window"></span>
          <span v-if="room.windows > 1" class="room-window second"></span>
          <strong>{{ format(room.length) }} x {{ format(room.height) }} {{ lengthUnit }}</strong>
        </div>
        <div class="visual-card-copy"><strong>{{ room.name }}</strong><span>{{ format(room.length) }} x {{ format(room.width) }} x {{ format(room.height) }} {{ lengthUnit }}</span><small>{{ room.doors }} door(s), {{ room.windows }} window(s)<template v-if="room.ceiling">, ceiling included</template></small></div>
      </article>
    </div>

    <div v-else-if="kind === 'flooring-tile' || kind === 'landscape-materials'" class="visual-grid shape-grid">
      <article v-for="area in visibleAreas" :key="area.id" class="visual-card">
        <svg class="area-shape" viewBox="0 0 220 130" role="img" :aria-label="`${area.name}: ${areaLabel(area)}`">
          <rect v-if="area.shape === 'rectangle'" x="25" y="20" width="170" height="90" rx="4" />
          <polygon v-else-if="area.shape === 'triangle'" points="28,108 192,108 110,20" />
          <circle v-else cx="110" cy="65" r="49" />
          <path v-if="kind === 'landscape-materials'" class="depth-line" d="M31 118h158" />
        </svg>
        <div class="visual-card-copy"><strong>{{ area.name }}</strong><span>{{ area.shape }}</span><small>{{ areaLabel(area) }}</small><small v-if="kind === 'landscape-materials'">Depth {{ format(landscapeDepth ?? 0) }} {{ landscapeDepthUnit }}</small></div>
      </article>
    </div>

    <div v-else-if="kind === 'concrete'" class="visual-grid shape-grid">
      <article v-for="section in visibleSections" :key="section.id" class="visual-card">
        <svg class="concrete-shape" viewBox="0 0 220 130" role="img" :aria-label="`${section.name}: ${sectionLabel(section)}`">
          <g v-if="section.shape === 'post'"><ellipse cx="110" cy="30" rx="44" ry="17" /><path d="M66 30v67c0 10 20 18 44 18s44-8 44-18V30" /><ellipse cx="110" cy="97" rx="44" ry="17" /></g>
          <g v-else-if="section.shape === 'steps'"><path d="M35 105h155V35h-45v23h-42v23H62v24z" /></g>
          <g v-else><path d="M35 51 96 23l91 25-61 30z" /><path d="M35 51v40l91 28V78M126 78l61-30v40l-61 31" /></g>
        </svg>
        <div class="visual-card-copy"><strong>{{ section.name }}</strong><span>{{ section.shape }}</span><small>{{ sectionLabel(section) }}</small></div>
      </article>
    </div>

    <div v-else class="visual-grid fence-grid">
      <article v-for="run in visibleRuns" :key="run.id" class="visual-card fence-card">
        <svg class="fence-shape" viewBox="0 0 220 105" role="img" :aria-label="`${run.name}: ${format(run.length)} ${lengthUnit}, ${run.gates} gates`">
          <path d="M16 45h188M16 73h188" />
          <path v-for="(_, index) in postMarkers(run)" :key="index" :d="`M${18 + index * 184 / (postMarkers(run).length - 1)} 22v70`" />
          <rect v-if="run.gates" x="86" y="35" width="48" height="57" class="gate" />
        </svg>
        <div class="visual-card-copy"><strong>{{ run.name }}</strong><span>{{ format(run.length) }} {{ lengthUnit }}</span><small>{{ runSections(run) }} section(s), {{ run.gates }} gate(s) at {{ format(run.gateWidth) }} {{ lengthUnit }}</small></div>
      </article>
    </div>
  </figure>
</template>

<style scoped>
.calculation-visual { margin: 0 2rem 2rem; padding: 1.25rem; border: 1px solid var(--line); border-radius: 18px; background: linear-gradient(135deg, color-mix(in srgb, var(--visual-accent) 8%, white), #fffdf8 55%); }
figcaption { display: grid; grid-template-columns: auto 1fr; gap: 1rem; align-items: start; margin-bottom: 1rem; }
figcaption > span { padding: .42rem .55rem; border-radius: 999px; background: var(--visual-accent); color: white; font: 900 .64rem/1 ui-monospace, monospace; letter-spacing: .08em; }
figcaption h3 { margin: 0; font-size: 1.2rem; }
figcaption p { margin: .25rem 0 0; color: #5d675f; font-size: .84rem; }
.visual-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; }
.visual-card { min-width: 0; display: grid; grid-template-columns: minmax(120px, .8fr) 1fr; gap: 1rem; align-items: center; padding: .85rem; border: 1px solid color-mix(in srgb, var(--visual-accent) 28%, var(--line)); border-radius: 13px; background: rgba(255,255,255,.78); }
.visual-card-copy { min-width: 0; display: grid; gap: .12rem; }
.visual-card-copy strong, .visual-card-copy span, .visual-card-copy small { overflow-wrap: anywhere; }
.visual-card-copy span { color: #4d5a53; font-size: .78rem; text-transform: capitalize; }
.visual-card-copy small { color: #68736c; font-size: .72rem; }
.room-shape { position: relative; min-height: 80px; max-height: 110px; border: 3px solid var(--visual-accent); background: repeating-linear-gradient(0deg, transparent 0 19px, #d8d0c744 20px), repeating-linear-gradient(90deg, transparent 0 19px, #d8d0c744 20px); }
.room-shape > strong { position: absolute; left: .35rem; top: .3rem; padding: .15rem .25rem; background: rgba(255,255,255,.9); font: 800 .64rem/1.2 ui-monospace, monospace; }
.room-door { position: absolute; right: 12%; bottom: -3px; width: 20%; height: 48%; border: 3px solid #17231f; border-bottom: 0; background: #fffdf8; }
.room-window { position: absolute; left: 13%; top: 41%; width: 21%; height: 26%; border: 3px solid #17231f; background: #d9edf0; }
.room-window.second { left: 39%; }
.area-shape, .concrete-shape, .fence-shape { width: 100%; max-height: 110px; color: var(--visual-accent); }
.area-shape rect, .area-shape polygon, .area-shape circle { fill: color-mix(in srgb, var(--visual-accent) 18%, white); stroke: currentColor; stroke-width: 5; }
.area-shape .depth-line { stroke: #17231f; stroke-width: 5; stroke-linecap: round; stroke-dasharray: 7 6; }
.concrete-shape path, .concrete-shape ellipse { fill: color-mix(in srgb, var(--visual-accent) 14%, white); stroke: currentColor; stroke-width: 4; stroke-linejoin: round; }
.fence-shape path { fill: none; stroke: currentColor; stroke-width: 4; stroke-linecap: round; }
.fence-shape .gate { fill: color-mix(in srgb, var(--visual-accent) 12%, white); stroke: #17231f; stroke-width: 3; }
.fence-card { grid-template-columns: minmax(180px, 1fr) .8fr; }

@media (max-width: 760px) {
  .calculation-visual { margin-inline: 1.2rem; }
  .visual-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  figcaption, .visual-card, .fence-card { grid-template-columns: 1fr; }
  figcaption > span { width: max-content; }
}
</style>

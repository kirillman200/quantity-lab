<script setup lang="ts">
import { computed, reactive } from 'vue';
import { calculatePaintCoverage, round, type PaintCoverageMode, type PaintVolumeUnit, type UnitSystem } from '../lib/calculations';

const input = reactive({
  mode: 'brush-roll' as PaintCoverageMode,
  outputUnit: 'imperial' as UnitSystem,
  containers: 1,
  containerVolume: 1,
  volumeUnit: 'us-gallon' as PaintVolumeUnit,
  labelCoveragePerGallon: 400,
  labelCoveragePerCan: 12,
  coats: 2,
  contingency: 10,
});

const result = computed(() => calculatePaintCoverage(input));
const areaUnit = computed(() => input.outputUnit === 'metric' ? 'm²' : 'sq ft');
const display = (value: number) => round(value, value < 10 ? 2 : 1).toLocaleString(undefined, { maximumFractionDigits: 2 });

const containerBenchmarks = computed(() => {
  const coverage = Math.max(0, Number(input.labelCoveragePerGallon) || 0);
  const factor = input.outputUnit === 'metric' ? 1 / 10.7639104167 : 1;
  return [
    { label: '1 US quart', area: coverage / 4 * factor },
    { label: '1 US gallon', area: coverage * factor },
    { label: '5 US gallons', area: coverage * 5 * factor },
    { label: '1 litre', area: coverage / 3.785411784 * factor },
  ];
});
</script>

<template>
  <section class="coverage-calculator" aria-labelledby="coverage-calculator-title">
    <header>
      <p class="step-label">QUICK COVERAGE CALCULATOR</p>
      <h2 id="coverage-calculator-title">How much area will this paint cover?</h2>
      <p>Use the coverage printed on your product. The result separates one-coat label area from a practical multi-coat project area.</p>
    </header>

    <div class="mode-row">
      <fieldset>
        <legend>Paint format</legend>
        <label><input v-model="input.mode" type="radio" value="brush-roll" /> Can or pail</label>
        <label><input v-model="input.mode" type="radio" value="spray" /> Spray can</label>
      </fieldset>
      <fieldset>
        <legend>Result units</legend>
        <label><input v-model="input.outputUnit" type="radio" value="imperial" /> Square feet</label>
        <label><input v-model="input.outputUnit" type="radio" value="metric" /> Square metres</label>
      </fieldset>
    </div>

    <div class="coverage-fields">
      <label>Number of containers<input v-model.number="input.containers" type="number" min="0" max="1000" step="1" /></label>
      <template v-if="input.mode === 'brush-roll'">
        <label>Volume per container<input v-model.number="input.containerVolume" type="number" min="0" max="1000" step="0.01" /></label>
        <label>Volume unit<select v-model="input.volumeUnit"><option value="us-gallon">US gallon</option><option value="us-quart">US quart</option><option value="litre">Litre</option></select></label>
        <label>Label coverage<input v-model.number="input.labelCoveragePerGallon" type="number" min="0" max="10000" step="1" /><span>sq ft per US gallon, per coat</span></label>
      </template>
      <template v-else>
        <label>Label coverage per can<input v-model.number="input.labelCoveragePerCan" type="number" min="0" max="1000" step="0.1" /><span>sq ft per can, per coat</span></label>
      </template>
      <label>Finish coats<input v-model.number="input.coats" type="number" min="1" max="20" step="1" /></label>
      <label>Contingency<input v-model.number="input.contingency" type="number" min="0" max="100" step="1" /><span>percent</span></label>
    </div>

    <div class="coverage-results" aria-live="polite">
      <div><span>Per container</span><strong>{{ display(result.perContainerArea) }}</strong><small>{{ areaUnit }} for one coat</small></div>
      <div><span>All containers</span><strong>{{ display(result.grossArea) }}</strong><small>{{ areaUnit }} for one coat</small></div>
      <div class="primary-result"><span>Practical project area</span><strong>{{ display(result.projectArea) }}</strong><small>{{ areaUnit }} after {{ input.coats }} coat(s) and {{ input.contingency }}% contingency</small></div>
    </div>

    <div v-if="input.mode === 'brush-roll'" class="benchmark-grid">
      <h3>Container-size comparison at {{ input.labelCoveragePerGallon }} sq ft per gallon</h3>
      <div v-for="item in containerBenchmarks" :key="item.label"><span>{{ item.label }}</span><strong>{{ display(item.area) }} {{ areaUnit }}</strong><small>one coat, before contingency</small></div>
    </div>
    <p class="calculator-note"><strong>Planning estimate:</strong> Texture, porosity, overspray, applicator choice, colour change, and technique can reduce real coverage. Confirm the product label and instructions.</p>
  </section>
</template>

<style scoped>
.coverage-calculator { --coverage-accent: #d6532f; overflow: hidden; border: 1px solid var(--line); border-radius: 24px; background: var(--white); box-shadow: var(--shadow); }
.coverage-calculator > header { padding: 2rem; background: #182820; color: white; }
.coverage-calculator h2 { margin: .35rem 0; font-size: clamp(1.8rem, 4vw, 2.8rem); }
.coverage-calculator header p:last-child { max-width: 760px; margin-bottom: 0; color: #bdcbc3; }
.step-label { margin: 0; color: #f59a70; font: 900 .7rem/1 ui-monospace, monospace; letter-spacing: .12em; }
.mode-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1.5rem 2rem 0; }
fieldset { min-width: 0; margin: 0; border: 1px solid #cfc6b7; border-radius: 12px; padding: .8rem 1rem; }
legend { padding-inline: .3rem; font-size: .78rem; font-weight: 900; }
fieldset label { display: inline-flex; align-items: center; gap: .35rem; margin-right: 1rem; font-size: .82rem; font-weight: 750; }
input[type='radio'] { accent-color: var(--coverage-accent); }
.coverage-fields { display: grid; grid-template-columns: repeat(3, minmax(140px, 1fr)); gap: .8rem; padding: 1.5rem 2rem 2rem; }
.coverage-fields label { display: grid; align-content: start; gap: .25rem; color: #4f5a54; font-size: .76rem; font-weight: 850; }
.coverage-fields input, .coverage-fields select { width: 100%; min-width: 0; border: 1px solid #cfc6b7; border-radius: 8px; background: white; color: var(--ink); padding: .7rem; font: inherit; font-size: .9rem; }
.coverage-fields span { color: #737b75; font-size: .68rem; font-weight: 650; }
.coverage-results { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; padding: 1px 0; background: var(--line); border-block: 1px solid var(--line); }
.coverage-results > div { min-width: 0; padding: 1.3rem 2rem; background: #f5f0e6; }
.coverage-results .primary-result { background: #fbded0; }
.coverage-results span, .coverage-results small { display: block; color: #667068; font-size: .72rem; font-weight: 750; }
.coverage-results strong { display: block; margin: .3rem 0; font-size: clamp(1.5rem, 4vw, 2.35rem); overflow-wrap: anywhere; }
.benchmark-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; padding: 2rem; background: #fffdfa; }
.benchmark-grid h3 { grid-column: 1 / -1; margin-top: 0; }
.benchmark-grid div { padding: 1rem; border: 1px solid var(--line); background: white; }
.benchmark-grid span, .benchmark-grid small { display: block; color: #667068; font-size: .7rem; }
.benchmark-grid strong { display: block; margin: .3rem 0; }
.calculator-note { margin: 0; padding: 1.2rem 2rem; border-top: 1px solid var(--line); background: #f1ebdf; font-size: .83rem; }
@media (max-width: 760px) { .mode-row, .coverage-results { grid-template-columns: 1fr; }.coverage-fields { grid-template-columns: 1fr 1fr; }.benchmark-grid { grid-template-columns: 1fr 1fr; }.coverage-results > div { padding-inline: 1.2rem; } }
@media (max-width: 480px) { .coverage-calculator { border-radius: 16px; }.coverage-calculator > header, .coverage-fields, .benchmark-grid { padding: 1.2rem; }.mode-row { padding: 1.2rem 1.2rem 0; }.coverage-fields, .benchmark-grid { grid-template-columns: 1fr; }.benchmark-grid h3 { grid-column: auto; } }
</style>

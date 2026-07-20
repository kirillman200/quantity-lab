import { describe, expect, it } from 'vitest';
import { areaOfShape, calculateConcrete, calculateFence, calculateFlooring, calculateLandscape, calculatePaint, concreteSectionVolume, cubicFeetToDisplay, finiteNonNegative, round } from '../src/lib/calculations';

describe('shared calculation helpers', () => {
  it('rejects negative and non-finite quantities', () => {
    expect(finiteNonNegative(-2)).toBe(0);
    expect(finiteNonNegative(Number.NaN)).toBe(0);
    expect(finiteNonNegative(4.2)).toBe(4.2);
    expect(round(1.005, 2)).toBe(1.01);
  });

  it('calculates rectangle, triangle, and circle area', () => {
    const base = { id: 'a', name: 'Area', length: 10, width: 6, diameter: 10 };
    expect(areaOfShape({ ...base, shape: 'rectangle' }, 'imperial')).toBeCloseTo(60);
    expect(areaOfShape({ ...base, shape: 'triangle' }, 'imperial')).toBeCloseTo(30);
    expect(areaOfShape({ ...base, shape: 'circle' }, 'imperial')).toBeCloseTo(Math.PI * 25);
    expect(areaOfShape({ ...base, shape: 'rectangle' }, 'metric')).toBeCloseTo(645.834625, 4);
  });

  it('converts cubic volume for metric display', () => {
    expect(cubicFeetToDisplay(35.3146667215, 'metric')).toBeCloseTo(1);
    expect(cubicFeetToDisplay(12, 'imperial')).toBe(12);
  });
});

describe('paint planner', () => {
  it('subtracts openings, applies coats and waste, then rounds packages', () => {
    const result = calculatePaint({
      unit: 'imperial', rooms: [{ id: '1', name: 'Room', length: 12, width: 10, height: 8, doors: 1, windows: 2, ceiling: false }],
      doorArea: 21, windowArea: 15, coats: 2, primerCoats: 1, coverage: 400, primerCoverage: 350, waste: 10, containerSize: 1, containerPrice: 42, primerContainerPrice: 32,
    });
    expect(result.wallArea).toBe(352);
    expect(result.openingsArea).toBe(51);
    expect(result.netArea).toBe(301);
    expect(result.paint.exact).toBeCloseTo(1.6555);
    expect(result.paint.packages).toBe(2);
    expect(result.paint.cost).toBe(84);
    expect(result.primer.packages).toBe(1);
  });

  it('supports metric inputs and litres', () => {
    const result = calculatePaint({ unit: 'metric', rooms: [{ id: '1', name: 'Metric room', length: 4, width: 3, height: 2.5, doors: 0, windows: 0, ceiling: true }], doorArea: 2, windowArea: 1.5, coats: 2, primerCoats: 0, coverage: 10, primerCoverage: 9, waste: 0, containerSize: 3.78, containerPrice: 50, primerContainerPrice: 0 });
    expect(result.netArea).toBeCloseTo(47);
    expect(result.paint.exact).toBeCloseTo(9.4);
    expect(result.paint.packages).toBe(3);
  });
});

describe('flooring planner', () => {
  it('combines area, pieces, packages, waste, and cost', () => {
    const result = calculateFlooring({ unit: 'imperial', areas: [{ id: '1', name: 'Room', shape: 'rectangle', length: 12, width: 14, diameter: 0 }], pieceLength: 48, pieceWidth: 8, pieceUnit: 'inch', packageCoverage: 20, waste: 10, packagePrice: 58 });
    expect(result.area).toBe(168);
    expect(result.purchaseArea).toBeCloseTo(184.8);
    expect(result.pieces).toBe(70);
    expect(result.packages).toBe(10);
    expect(result.cost).toBe(580);
  });

  it('supports metric areas, centimetre pieces, and safe zero package inputs', () => {
    const result = calculateFlooring({ unit: 'metric', areas: [{ id: '1', name: 'Tile', shape: 'rectangle', length: 2, width: 2, diameter: 0 }], pieceLength: 20, pieceWidth: 20, pieceUnit: 'cm', packageCoverage: 0, waste: 0, packagePrice: 10 });
    expect(result.area).toBeCloseTo(4);
    expect(result.pieces).toBe(100);
    expect(result.packages).toBe(0);
    const emptyPiece = calculateFlooring({ ...{ unit: 'imperial' as const, areas: [], pieceLength: 0, pieceWidth: 0, pieceUnit: 'inch' as const, packageCoverage: 1, waste: 0, packagePrice: 0 } });
    expect(emptyPiece.pieces).toBe(0);
  });
});

describe('landscape planner', () => {
  it('compares bags with quarter-unit bulk delivery', () => {
    const result = calculateLandscape({ unit: 'imperial', areas: [{ id: '1', name: 'Bed', shape: 'rectangle', length: 20, width: 6, diameter: 0 }], depth: 3, depthUnit: 'inch', waste: 10, bagVolume: 2, bagVolumeUnit: 'cubic-feet', bagPrice: 6.5, bulkPrice: 52 });
    expect(result.cubicFeet).toBeCloseTo(33);
    expect(result.bags).toBe(17);
    expect(result.bulkUnits).toBe(1.25);
    expect(result.cheapest).toBe('bulk');
    expect(result.bulkCost).toBe(65);
  });

  it('supports metric centimetres and litre bags', () => {
    const result = calculateLandscape({ unit: 'metric', areas: [{ id: '1', name: 'Bed', shape: 'rectangle', length: 2, width: 2, diameter: 0 }], depth: 10, depthUnit: 'cm', waste: 0, bagVolume: 40, bagVolumeUnit: 'litres', bagPrice: 5, bulkPrice: 100 });
    expect(result.cubicMetres).toBeCloseTo(.4);
    expect(result.bags).toBe(10);
    expect(result.bulkUnits).toBe(.5);
    expect(result.cheapest).toBe('equal');
    expect(calculateLandscape({ ...{ unit: 'imperial' as const, areas: [], depth: 1, depthUnit: 'inch' as const, waste: 0, bagVolume: 0, bagVolumeUnit: 'cubic-feet' as const, bagPrice: 0, bulkPrice: 1 } }).bags).toBe(0);
  });
});

describe('concrete planner', () => {
  it('calculates rectangular, cylindrical, and step volumes', () => {
    const slab = { id: '1', name: 'Slab', shape: 'slab' as const, length: 10, width: 8, depth: 1 / 3, diameter: 0, count: 1, rise: 0, run: 0 };
    const post = { ...slab, shape: 'post' as const, diameter: 1, depth: 3, count: 2 };
    const steps = { ...slab, shape: 'steps' as const, width: 4, rise: .5, run: 1, count: 3 };
    expect(concreteSectionVolume(slab, 'imperial')).toBeCloseTo(26.6667);
    expect(concreteSectionVolume(post, 'imperial')).toBeCloseTo(Math.PI * .25 * 3 * 2);
    expect(concreteSectionVolume(steps, 'imperial')).toBe(6);
  });

  it('ranks package options using whole-bag cost', () => {
    const result = calculateConcrete({ unit: 'imperial', sections: [{ id: '1', name: 'Slab', shape: 'slab', length: 10, width: 8, depth: 1 / 3, diameter: 0, count: 1, rise: 0, run: 0 }], waste: 10, packages: [{ id: 'small', name: 'Small', yieldCubicFeet: .45, price: 6.2 }, { id: 'large', name: 'Large', yieldCubicFeet: .6, price: 7.6 }] });
    expect(result.purchaseCubicFeet).toBeCloseTo(29.3333);
    expect(result.packageResults[0].bags).toBe(66);
    expect(result.packageResults[1].bags).toBe(49);
    expect(result.cheapestPackageId).toBe('large');
  });

  it('handles unavailable yields and unpriced packages', () => {
    const result = calculateConcrete({ unit: 'imperial', sections: [], waste: 0, packages: [{ id: 'none', name: 'Unknown', yieldCubicFeet: 0, price: 0 }] });
    expect(result.packageResults[0].bags).toBe(0);
    expect(result.cheapestPackageId).toBeNull();
  });
});

describe('fence planner', () => {
  it('deducts gates and counts independent run posts', () => {
    const result = calculateFence({ unit: 'imperial', runs: [{ id: '1', name: 'Back', length: 60, gates: 1, gateWidth: 4 }], spacing: 8, railsPerSection: 2, picketWidth: 5.5, picketGap: .5, postPrice: 18, panelPrice: 0, railPrice: 9, picketPrice: 2.2, concreteBagsPerPost: 1.5, concreteBagPrice: 7.6 });
    expect(result.netLength).toBe(56);
    expect(result.sections).toBe(7);
    expect(result.linePosts).toBe(8);
    expect(result.gatePosts).toBe(2);
    expect(result.rails).toBe(14);
    expect(result.pickets).toBe(112);
    expect(result.concreteBags).toBe(15);
  });

  it('supports metric layout and safely handles zero spacing and picket pitch', () => {
    const result = calculateFence({ unit: 'metric', runs: [{ id: '1', name: 'Run', length: 10, gates: 0, gateWidth: 1 }], spacing: 0, railsPerSection: 2, picketWidth: 0, picketGap: 0, postPrice: 0, panelPrice: 0, railPrice: 0, picketPrice: 0, concreteBagsPerPost: 0, concreteBagPrice: 0 });
    expect(result.netLength).toBeCloseTo(10);
    expect(result.sections).toBe(0);
    expect(result.pickets).toBe(0);
  });
});

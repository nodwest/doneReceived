import type { Feature, Polygon } from 'geojson';
import { describe, expect, it } from 'vitest';

import { buildCityDetails } from './city-details';

const tileSize = 2 ** 13 * 4096;
const toLongitude = (units: number) => (units * 360) / tileSize - 180;
const toLatitude = (units: number) =>
  (Math.atan(Math.sinh(Math.PI * (1 - (2 * units) / tileSize))) * 180) /
  Math.PI;

function building(right: number, bottom: number): Feature<Polygon> {
  const left = toLongitude(5000 * 4096 + 20);
  const top = toLatitude(2872 * 4096 + 34);
  const x = toLongitude(right);
  const y = toLatitude(bottom);
  return {
    type: 'Feature',
    id: 123,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [left, top],
          [x, top],
          [x, y],
          [left, y],
          [left, top],
        ],
      ],
    },
    properties: { height: 18, min_height: 4 },
  };
}

describe('buildCityDetails', () => {
  const tileEdge = 5000 * 4096 + 64;
  const bottom = 2872 * 4096 + 112;

  it('skips buffered tile cuts when decorating walls and roofs', () => {
    const clipped = buildCityDetails([building(tileEdge, bottom)], [], 18);
    const complete = buildCityDetails([building(tileEdge - 1, bottom)], [], 18);

    expect(
      clipped.parapets.features.map((feature) => feature.properties.kind),
    ).toEqual(['parapet', 'parapet', 'parapet']);
    expect(
      complete.parapets.features.filter(
        (feature) => feature.properties.kind === 'parapet',
      ),
    ).toHaveLength(4);
    expect(clipped.windows.features.length).toBeLessThan(
      complete.windows.features.length,
    );
    expect(
      clipped.windows.features.every((feature) => feature.properties.base > 4),
    ).toBe(true);
  });

  it('keeps the outer parapet and removes the strip across a shared roof', () => {
    const left = building(tileEdge - 1, bottom);
    const right = building(tileEdge + 46, bottom);
    const edge = left.geometry.coordinates[0][1][0];
    for (const point of right.geometry.coordinates[0]) {
      if (point[0] < edge) point[0] = edge;
    }
    const parapetCount = (features: Feature[]) =>
      buildCityDetails(features, [], 18).parapets.features.filter(
        (feature) => feature.properties.kind === 'parapet',
      ).length;

    expect(parapetCount([left, right])).toBe(6);
  });

  it('does not decorate a zero-area edge extending outside a building', () => {
    const original = building(tileEdge - 1, bottom);
    const spiked = building(tileEdge - 1, bottom);
    const ring = spiked.geometry.coordinates[0];
    const corner = ring[1];
    ring.splice(2, 0, [corner[0] + 0.0004, corner[1] + 0.0001], corner);
    const plain = buildCityDetails([original], [], 18);
    const withSpike = buildCityDetails([spiked], [], 18);

    expect(withSpike.windows).toEqual(plain.windows);
    expect(
      withSpike.parapets.features.filter(
        (f) => f.properties.kind === 'parapet',
      ),
    ).toEqual(
      plain.parapets.features.filter((f) => f.properties.kind === 'parapet'),
    );
  });

  it('filters individual buildings in a grouped tile feature', () => {
    const house = building(tileEdge - 1, bottom);
    const nearby = house.geometry.coordinates[0];
    const distant = nearby.map(([lng, lat]) => [lng + 0.05, lat]);
    const grouped: Feature = {
      ...house,
      geometry: { type: 'MultiPolygon', coordinates: [[distant], [nearby]] },
    };
    const [lng, lat] = nearby[0];
    const bounds = [
      lng - 0.001,
      lat - 0.001,
      lng + 0.001,
      lat + 0.001,
    ] as const;
    expect(buildCityDetails([grouped], [], 18, bounds)).toEqual(
      buildCityDetails([house], [], 18, bounds),
    );
  });

  it('keeps the same decor after zooming and removes duplicate outlines', () => {
    const house = building(tileEdge - 1, bottom);
    expect(buildCityDetails([house, house], [], 17)).toEqual(
      buildCityDetails([house], [], 18.5),
    );
  });
});

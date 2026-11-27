import { validateStyleMin } from '@maplibre/maplibre-gl-style-spec';
import { describe, expect, it } from 'vitest';
import { MAP_STYLES } from './map-style';

describe('2D map themes', () => {
  it.each(Object.entries(MAP_STYLES))('validates the %s style', (_, style) => {
    expect(validateStyleMin(JSON.parse(JSON.stringify(style)))).toEqual([]);
  });

  it('can switch themes in place by updating paint only', () => {
    const paintStructure = ({
      layers,
      ...style
    }: (typeof MAP_STYLES)['light']) => ({
      ...style,
      layers: layers.map((layer) => {
        if (!('paint' in layer)) return layer;
        const { paint, ...structure } = layer;
        return { ...structure, paintProperties: Object.keys(paint ?? {}) };
      }),
    });

    expect(paintStructure(MAP_STYLES.dark)).toEqual(
      paintStructure(MAP_STYLES.light),
    );
    expect(MAP_STYLES.dark.layers).not.toEqual(MAP_STYLES.light.layers);
  });
});

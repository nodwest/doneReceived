import type { FeatureCollection, Geometry, Polygon } from 'geojson';
import type {
  CircleLayerSpecification,
  FillLayerSpecification,
  LineLayerSpecification,
  SymbolLayerSpecification,
} from 'maplibre-gl';
import type { MapZone, ZonePoint } from '@entities/zone';

/** Источник и слои геозон семьи: контур, заливка и название. */
export const ZONE_SOURCE = 'family-zones';

export const ZONE_LAYER_IDS = [
  'family-zones-fill',
  'family-zones-outline',
  'family-zone-labels',
] as const;

type ZoneProperties = {
  id: string;
  name: string;
};

/** Геозоны в GeoJSON-полигоны: контур замыкаем сами, скрытые не включаем. */
export function zonesToGeoJson(
  zones: readonly MapZone[],
  hidden: readonly string[],
): FeatureCollection<Polygon, ZoneProperties> {
  const hiddenIds = new Set(hidden);
  return {
    type: 'FeatureCollection',
    features: zones
      .filter((zone) => !hiddenIds.has(zone.id) && zone.points.length > 0)
      .map((zone) => {
        const ring: [number, number][] = zone.points.map(({ lng, lat }) => [
          lng,
          lat,
        ]);
        const first = ring[0];
        const last = ring[ring.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) ring.push(first);
        return {
          type: 'Feature' as const,
          geometry: { type: 'Polygon' as const, coordinates: [ring] },
          properties: { id: zone.id, name: zone.name },
        };
      }),
  };
}

const zoneFillLayer: FillLayerSpecification = {
  id: ZONE_LAYER_IDS[0],
  type: 'fill',
  source: ZONE_SOURCE,
  paint: {
    'fill-color': '#6C5CE7',
    'fill-opacity': 0.12,
  },
};

const zoneOutlineLayer: LineLayerSpecification = {
  id: ZONE_LAYER_IDS[1],
  type: 'line',
  source: ZONE_SOURCE,
  paint: {
    'line-color': '#6C5CE7',
    'line-width': 1.5,
    'line-opacity': 0.7,
  },
};

const zoneLabelsLayer: SymbolLayerSpecification = {
  id: ZONE_LAYER_IDS[2],
  type: 'symbol',
  source: ZONE_SOURCE,
  layout: {
    'text-field': ['get', 'name'],
    'text-size': 12,
    'text-font': ['Noto Sans Medium'],
    'text-allow-overlap': false,
    'text-padding': 4,
  },
  paint: {
    'text-color': '#1A1A2E',
    'text-halo-color': '#FFFFFF',
    'text-halo-width': 1.5,
  },
};

export const ZONE_LAYERS = [zoneFillLayer, zoneOutlineLayer, zoneLabelsLayer];

/** Незаконченный контур в редакторе области: заливка, линия и вершины. */
export const ZONE_DRAFT_SOURCE = 'zone-draft';

export const ZONE_DRAFT_LAYER_IDS = [
  'zone-draft-fill',
  'zone-draft-line',
  'zone-draft-points',
] as const;

export function zoneDraftToGeoJson(
  points: readonly ZonePoint[],
  selectedIndex: number | null = null,
): FeatureCollection<Geometry> {
  const coordinates = points.map(
    ({ lng, lat }) => [lng, lat] as [number, number],
  );
  const features: FeatureCollection<Geometry>['features'] = [];

  if (coordinates.length >= 2) {
    features.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates },
      properties: {},
    });
  }
  if (coordinates.length >= 3) {
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[...coordinates, coordinates[0]]],
      },
      properties: {},
    });
  }
  coordinates.forEach((point, index) => {
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: point },
      properties: { selected: index === selectedIndex },
    });
  });

  return { type: 'FeatureCollection', features };
}

const draftFillLayer: FillLayerSpecification = {
  id: ZONE_DRAFT_LAYER_IDS[0],
  type: 'fill',
  source: ZONE_DRAFT_SOURCE,
  filter: ['==', ['geometry-type'], 'Polygon'],
  paint: {
    'fill-color': '#6C5CE7',
    'fill-opacity': 0.14,
  },
};

const draftLineLayer: LineLayerSpecification = {
  id: ZONE_DRAFT_LAYER_IDS[1],
  type: 'line',
  source: ZONE_DRAFT_SOURCE,
  filter: ['==', ['geometry-type'], 'LineString'],
  paint: {
    'line-color': '#6C5CE7',
    'line-width': 2,
    'line-dasharray': [2, 1],
  },
};

const draftPointsLayer: CircleLayerSpecification = {
  id: ZONE_DRAFT_LAYER_IDS[2],
  type: 'circle',
  source: ZONE_DRAFT_SOURCE,
  paint: {
    'circle-radius': 5,
    'circle-color': '#6C5CE7',
    // Выбранная вершина — красная обводка, остальные белые.
    'circle-stroke-color': ['case', ['get', 'selected'], '#E5484D', '#FFFFFF'],
    'circle-stroke-width': ['case', ['get', 'selected'], 3, 2],
  },
};

export const ZONE_DRAFT_LAYERS = [
  draftFillLayer,
  draftLineLayer,
  draftPointsLayer,
];

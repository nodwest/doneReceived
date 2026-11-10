export const OSM_SOURCE = {
  type: 'vector' as const,
  url:
    process.env.EXPO_PUBLIC_MAP_TILEJSON_URL ??
    'https://maps.divmaster.space/tiles/russia.json',
  attribution:
    '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>',
};

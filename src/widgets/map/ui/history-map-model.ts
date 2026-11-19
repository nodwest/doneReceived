export type HistoryPoint = {
  lat: number;
  lng: number;
  accuracy: number | null;
  recordedAt: string;
  transitions: { zoneId: string; zoneName: string; to: 'inside' | 'outside' }[];
};

export type HistoryMarker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  detail: string;
  task?: boolean;
};

export type HistoryMapProps = {
  points: HistoryPoint[];
  markers: HistoryMarker[];
  selected: string | null;
  focusVersion: number;
  routeKey: string;
  bottomInset: number;
  onSelect: (id: string) => void;
};

export const HISTORY_GAP_COLOR = '#8d93a7';

export function routeSegments(points: HistoryPoint[], gaps = false) {
  return points.slice(1).flatMap((end, index) => {
    const start = points[index];
    const elapsed = Date.parse(end.recordedAt) - Date.parse(start.recordedAt);
    return elapsed > 0 &&
      (gaps ? elapsed > 120_000 : elapsed <= 120_000) &&
      start.accuracy !== null &&
      start.accuracy <= 100 &&
      end.accuracy !== null &&
      end.accuracy <= 100
      ? [{ start, end }]
      : [];
  });
}

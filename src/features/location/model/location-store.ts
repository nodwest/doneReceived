import { create } from 'zustand';
import type { Location, ZonePresence } from '@entities/user';

export type LiveLocation = {
  userId: string;
  childId: string | null;
  lat: number;
  lng: number;
  accuracy?: number | null;
  zoneId: string | null;
  zones?: ZonePresence[];
  /** Подтверждённо дома; в старых событиях поля нет. */
  atHome?: boolean;
  /** Когда пришёл домой или ушёл; null — момент неизвестен. */
  atHomeSince?: string | null;
  deviceId: string | null;
  deviceLabel: string;
  updatedAt?: string;
  recordedAt?: string;
};

type LocationStore = {
  locations: Record<string, LiveLocation>;
  hiddenAccess: Record<string, boolean>;
  setLocation: (location: Location) => void;
  setAccess: (userId: string, visible: boolean) => void;
  reset: () => void;
};

const deviceLabel = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value : 'Устройство';

/** Более свежее время: запоздавшее событие не должно откатить точку назад. */
const later = (a: string | undefined, b: string | undefined) => {
  if (!a) return b;
  if (!b) return a;
  return Date.parse(b) > Date.parse(a) ? b : a;
};

export const useLocationStore = create<LocationStore>((set) => ({
  locations: {},
  hiddenAccess: {},
  setLocation: (location) =>
    set((state) => {
      const previous = state.locations[location.userId];
      const measuredAt = location.recordedAt ?? location.updatedAt;
      const previousMeasuredAt = previous?.recordedAt ?? previous?.updatedAt;
      if (
        previousMeasuredAt &&
        measuredAt &&
        Date.parse(measuredAt) <= Date.parse(previousMeasuredAt)
      ) {
        return state;
      }
      const atHome =
        location.atHome === undefined ? previous?.atHome : location.atHome;
      const atHomeSince =
        location.atHome === undefined
          ? (previous?.atHomeSince ?? null)
          : (location.atHomeSince ?? null);
      return {
        locations: {
          ...state.locations,
          [location.userId]: {
            userId: location.userId,
            childId: location.childId,
            lat: location.lat,
            lng: location.lng,
            accuracy: location.accuracy,
            zoneId: location.zoneId ?? null,
            zones: location.zones ?? previous?.zones,
            atHome,
            atHomeSince,
            deviceId: location.deviceId ?? null,
            deviceLabel: deviceLabel(location.deviceLabel),
            updatedAt: later(previous?.updatedAt, location.updatedAt),
            recordedAt: later(previous?.recordedAt, location.recordedAt),
          },
        },
      };
    }),
  setAccess: (userId, visible) =>
    set((state) => ({
      hiddenAccess: {
        ...state.hiddenAccess,
        [userId]: !visible,
      },
    })),
  reset: () => set({ locations: {}, hiddenAccess: {} }),
}));

export const useLiveLocations = () =>
  useLocationStore((state) => state.locations);
export const useLiveHiddenAccess = () =>
  useLocationStore((state) => state.hiddenAccess);

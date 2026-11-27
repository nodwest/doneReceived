import { describe, expect, it } from 'vitest';
import type { FamilyMember } from '@entities/family';
import type { FamilyLocation, LiveLocation } from '@features/location';
import { collectFamilyMarkers } from './family-markers';

const member = (userId: string, over: Partial<FamilyMember> = {}) =>
  ({
    id: `member-${userId}`,
    userId,
    displayName: 'Михалыч',
    avatarUrl: null,
    role: 'member',
    kind: 'child',
    childId: `child-${userId}`,
    mapColor: '#2F80DD',
    ...over,
  }) as FamilyMember;

const saved = (userId: string, over: Partial<FamilyLocation> = {}) =>
  ({
    userId,
    childId: `child-${userId}`,
    lat: 55.75,
    lng: 37.61,
    zoneId: null,
    deviceId: 'device-1',
    deviceLabel: 'Redmi',
    recordedAt: '2026-11-27T10:00:00.000Z',
    ...over,
  }) as FamilyLocation;

const live = (userId: string, over: Partial<LiveLocation> = {}) =>
  ({
    userId,
    childId: `child-${userId}`,
    lat: 55.76,
    lng: 37.62,
    zoneId: null,
    deviceId: 'device-1',
    deviceLabel: 'Redmi',
    recordedAt: '2026-11-27T10:05:00.000Z',
    ...over,
  }) as LiveLocation;

const base = {
  family: { id: 'family' },
  members: [member('u1')],
  saved: [] as FamilyLocation[],
  live: {} as Record<string, LiveLocation>,
  hiddenChildren: [] as string[],
  hiddenAccess: {} as Record<string, boolean>,
  deviceFallback: 'Device',
};

describe('collectFamilyMarkers', () => {
  it('берёт сохранённую точку и подставляет переведённое имя устройства', () => {
    const markers = collectFamilyMarkers({
      ...base,
      saved: [saved('u1', { deviceLabel: '' })],
    });
    expect(markers).toHaveLength(1);
    expect(markers[0]).toMatchObject({
      userId: 'u1',
      childId: 'child-u1',
      deviceLabel: 'Device',
      name: 'Михалыч',
      color: '#2F80DD',
    });
  });

  it('сохраняет имя устройства, если оно есть', () => {
    const markers = collectFamilyMarkers({ ...base, saved: [saved('u1')] });
    expect(markers[0].deviceLabel).toBe('Redmi');
  });

  it('свежая живая точка заменяет сохранённую, старая — нет', () => {
    const fresh = collectFamilyMarkers({
      ...base,
      saved: [saved('u1')],
      live: { u1: live('u1') },
    });
    expect(fresh[0].lat).toBe(55.76);
    expect(fresh[0].updatedAt).toBe('2026-11-27T10:05:00.000Z');

    const stale = collectFamilyMarkers({
      ...base,
      saved: [saved('u1')],
      live: { u1: live('u1', { recordedAt: '2026-11-27T09:55:00.000Z' }) },
    });
    expect(stale[0].lat).toBe(55.75);

    const same = collectFamilyMarkers({
      ...base,
      saved: [saved('u1')],
      live: { u1: live('u1', { recordedAt: '2026-11-27T10:00:00.000Z' }) },
    });
    expect(same[0].lat).toBe(55.75);
  });

  it('живая точка без времени не перебивает сохранённую со временем', () => {
    const markers = collectFamilyMarkers({
      ...base,
      saved: [saved('u1')],
      live: { u1: live('u1', { recordedAt: undefined, updatedAt: undefined }) },
    });
    expect(markers[0].lat).toBe(55.75);
  });

  it('живая точка без времени заменяет сохранённую без времени', () => {
    const markers = collectFamilyMarkers({
      ...base,
      saved: [saved('u1', { recordedAt: undefined })],
      live: { u1: live('u1', { recordedAt: undefined, updatedAt: undefined }) },
    });
    expect(markers[0].lat).toBe(55.76);
  });

  it('скрытый участник и закрытый доступ не дают метку', () => {
    expect(
      collectFamilyMarkers({
        ...base,
        saved: [saved('u1')],
        hiddenChildren: ['u1'],
      }),
    ).toHaveLength(0);
    expect(
      collectFamilyMarkers({
        ...base,
        saved: [saved('u1')],
        hiddenAccess: { u1: true },
      }),
    ).toHaveLength(0);
  });

  it('без семьи, без участника и без профиля ребёнка меток нет', () => {
    expect(
      collectFamilyMarkers({ ...base, family: null, saved: [saved('u1')] }),
    ).toHaveLength(0);
    expect(
      collectFamilyMarkers({ ...base, members: [], saved: [saved('u1')] }),
    ).toHaveLength(0);
    expect(
      collectFamilyMarkers({
        ...base,
        saved: [saved('u1', { childId: null })],
      }),
    ).toHaveLength(0);
    expect(
      collectFamilyMarkers({
        ...base,
        saved: [saved('u1')],
        live: { u2: live('u2') },
      }),
    ).toHaveLength(1);
  });

  it('родитель в метки не попадает, даже если у него есть точка', () => {
    const markers = collectFamilyMarkers({
      ...base,
      members: [member('p1', { kind: 'parent', childId: null })],
      saved: [saved('p1', { childId: 'child-p1' })],
    });
    expect(markers).toHaveLength(0);
  });

  it('несколько детей — по метке каждому, порядок как пришёл', () => {
    const markers = collectFamilyMarkers({
      ...base,
      members: [member('u1'), member('u2', { displayName: 'Гермем' })],
      saved: [saved('u1'), saved('u2')],
    });
    expect(markers.map((marker) => marker.name)).toEqual(['Михалыч', 'Гермем']);
  });
});

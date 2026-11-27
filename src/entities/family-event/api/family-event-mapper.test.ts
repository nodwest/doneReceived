import { describe, expect, it } from 'vitest';
import { toFamilyEvent } from './family-event-mapper';
import type { components } from './generated/calendar';

type FamilyEventDto = components['schemas']['FamilyEventDto'];

const image = (url: string) => ({ uri: `image:${url}` });

const dto = (overrides: Partial<FamilyEventDto> = {}): FamilyEventDto => ({
  id: '0f8fad5b-d9cb-469f-a165-70867728950e',
  title: 'К бабушке',
  description: 'Ночуем и возвращаемся.',
  startsAt: '2026-12-05T06:00:00.000Z',
  endsAt: '2026-12-05T15:00:00.000Z',
  timezone: 'Europe/Moscow',
  repeat: 'once',
  kind: 'trip',
  photoUrl: null,
  reminderLeadMinutes: null,
  reminderDailyDays: null,
  reminderDailyMinute: null,
  audienceUserIds: null,
  participants: [],
  viewer: { canEdit: true, response: null },
  createdAt: '2026-11-01T00:00:00.000Z',
  updatedAt: '2026-11-01T00:00:00.000Z',
  ...overrides,
});

describe('toFamilyEvent', () => {
  it('maps dates, participants and nullable fields', () => {
    const event = toFamilyEvent(
      dto({
        participants: [
          {
            userId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
            displayName: 'Эмма',
            avatarUrl: '/users/avatars/avatar-1',
          },
          {
            userId: '2b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
            displayName: 'Без фото',
            avatarUrl: null,
          },
        ],
      }),
      image,
    );

    expect(event.startsAt).toEqual(new Date('2026-12-05T06:00:00.000Z'));
    expect(event.endsAt).toEqual(new Date('2026-12-05T15:00:00.000Z'));
    expect(event.participants).toEqual([
      {
        id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
        name: 'Эмма',
        avatar: { uri: 'image:/users/avatars/avatar-1' },
      },
      {
        id: '2b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
        name: 'Без фото',
        avatar: null,
      },
    ]);
    expect(event.photo).toBeUndefined();
    expect(event.reminderLeadMinutes).toBeUndefined();
    expect(event.reminderAt).toBeUndefined();
    expect(event.response).toBeUndefined();
    expect(event.canEdit).toBe(true);
  });

  it('uses the API path for a private event cover even if the server sends the site origin', () => {
    const eventId = dto().id;
    const path = `/families/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/events/${eventId}/photo/2b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed`;
    expect(
      toFamilyEvent(dto({ photoUrl: `https://app.example.test${path}` }), image)
        .photo,
    ).toEqual({ uri: `image:${path}` });
  });

  it('shows a participant once and keeps their available avatar', () => {
    const person = { userId: 'person', displayName: 'Эмма', avatarUrl: null };
    const event = toFamilyEvent(
      dto({
        participants: [person, { ...person, avatarUrl: '/avatar' }, person],
      }),
      image,
    );

    expect(event.participants).toEqual([
      { id: 'person', name: 'Эмма', avatar: { uri: 'image:/avatar' } },
    ]);
  });

  it('maps a personal response, photo and reminder', () => {
    const event = toFamilyEvent(
      dto({
        photoUrl: '/families/f/events/e/photo/p',
        reminderLeadMinutes: 1440,
        viewer: { canEdit: false, response: 'not_going' },
      }),
      image,
    );

    expect(event.photo).toEqual({ uri: 'image:/families/f/events/e/photo/p' });
    expect(event.reminderLeadMinutes).toBe(1440);
    expect(event.reminderAt).toEqual(new Date('2026-12-04T06:00:00.000Z'));
    expect(event.response).toBe('not_going');
    expect(event.canEdit).toBe(false);
  });

  it('keeps compatibility with an older server that omits new fields', () => {
    const legacy = dto();
    delete (legacy as Partial<FamilyEventDto>).kind;
    delete (legacy as Partial<FamilyEventDto>).participants;
    delete (legacy as Partial<FamilyEventDto>).viewer;
    delete (legacy as Partial<FamilyEventDto>).photoUrl;
    delete (legacy as Partial<FamilyEventDto>).reminderLeadMinutes;

    const event = toFamilyEvent(legacy, image);
    expect(event.kind).toBe('event');
    expect(event.participants).toEqual([]);
    expect(event.photo).toBeUndefined();
    expect(event.response).toBeUndefined();
    expect(event.canEdit).toBe(false);
  });

  it('keeps restricted audience separate from event participants', () => {
    const audienceUserIds = ['1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'];
    const event = toFamilyEvent(dto({ audienceUserIds }), image);

    expect(event.audienceUserIds).toEqual(audienceUserIds);
    expect(event.participants).toEqual([]);
    expect(
      toFamilyEvent(dto({ audienceUserIds: [] }), image).audienceUserIds,
    ).toEqual([]);
    expect(toFamilyEvent(dto(), image).audienceUserIds).toBeNull();
  });

  it('ignores extra fields from the server', () => {
    const event = toFamilyEvent(
      dto({
        ...({
          clientRequestId: 'secret-request-id',
          createdBy: '3b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
        } as Partial<FamilyEventDto>),
      }),
      image,
    );

    expect(event).not.toHaveProperty('clientRequestId');
    expect(event).not.toHaveProperty('createdBy');
  });
});

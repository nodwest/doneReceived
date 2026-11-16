import { useMemo } from 'react';
import type { ImageSourcePropType } from 'react-native';
import {
  useCurrentFamily,
  useFamilyMembers,
  type FamilyMember,
} from '@entities/family';
import type { FamilyEvent, FamilyEventPerson } from '@entities/family-event';
import { authorizedImage } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import {
  addDays,
  formatClock,
  formatMonthDay,
  formatWeekdayShort,
  startOfDay,
  useNow,
} from '@shared/lib';

const TRIP_PHOTO: ImageSourcePropType = require('./calendar-trip.jpg');

/** Время в локальной зоне на конкретный день. */
const at = (date: Date, hours: number, minutes = 0) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);

/**
 * Демо-события до появления серверного календаря. Все имена, аватары и
 * количество участников берутся из семьи; в тексте нет вымышленных людей.
 * Когда появится GET /families/:id/events, этот хук заменяется запросом.
 */
export function useCalendarDemo() {
  const { t } = useTranslation();
  const now = useNow(60_000);
  const today = useMemo(() => startOfDay(now), [now]);
  const familyId = useCurrentFamily()?.id ?? null;
  const { data: members = [] } = useFamilyMembers(familyId);

  return useMemo(() => {
    const parents = members.filter((member) => member.kind === 'parent');
    const children = members.filter((member) => member.kind === 'child');
    const firstParent = parents[0];
    const secondParent = parents[1];
    const firstChild = children[0];

    const toPerson = (member: FamilyMember): FamilyEventPerson => ({
      id: member.userId,
      name: member.displayName,
      avatar: member.avatarUrl ? authorizedImage(member.avatarUrl) : null,
    });

    const joinNames = (people: FamilyEventPerson[]) => {
      const names = people.map((person) => person.name);
      if (names.length === 0) return '';
      if (names.length === 1) return names[0];
      return `${names.slice(0, -1).join(', ')} ${t('common.and')} ${
        names[names.length - 1]
      }`;
    };

    const saturday = (() => {
      const day = today.getDay();
      const delta = day === 6 ? 0 : (6 - day + 7) % 7;
      return addDays(today, delta);
    })();
    const sunday = addDays(saturday, 1);
    const thursday = (() => {
      const day = today.getDay();
      const delta = (4 - day + 7) % 7;
      // Если четверг уже прошёл по времени, берём следующий.
      return addDays(today, delta === 0 && now.getHours() >= 17 ? 7 : delta);
    })();

    const tripPeople = [firstParent, ...children.slice(0, 2)]
      .filter((member): member is FamilyMember => !!member)
      .map(toPerson);
    const tripNames = joinNames(tripPeople);
    const stayingParent = secondParent ? toPerson(secondParent) : null;

    const tripDescription =
      tripPeople.length < 2
        ? t('calendar.featured.descriptionAlone')
        : stayingParent
          ? t('calendar.featured.description', {
              names: tripNames,
              staying: stayingParent.name,
            })
          : t('calendar.featured.descriptionNoStaying', {
              names: tripNames,
            });

    const cinemaPeople = children.slice(0, 2).map(toPerson);
    const cinemaNames = joinNames(cinemaPeople);
    const cinemaTime = formatClock(at(saturday, 16));
    const cinemaMeta = cinemaPeople.length
      ? t('calendar.demo.meta', {
          time: cinemaTime,
          names: cinemaNames,
        })
      : t('calendar.demo.metaTime', { time: cinemaTime });

    const doctorPeople = [firstParent, firstChild]
      .filter((member): member is FamilyMember => !!member)
      .map(toPerson);
    const doctorNames = joinNames(doctorPeople);
    const doctorTime = formatClock(at(thursday, 17));
    const doctorMeta = doctorPeople.length
      ? t('calendar.demo.meta', {
          time: doctorTime,
          names: doctorNames,
        })
      : t('calendar.demo.metaTime', { time: doctorTime });
    const doctorTitle = firstChild
      ? t('calendar.demo.doctorNamed', { name: firstChild.displayName })
      : t('calendar.demo.doctor');

    const meetingTime = formatClock(at(thursday, 18, 30));
    const meetingMeta = firstParent
      ? t('calendar.demo.meta', {
          time: meetingTime,
          names: firstParent.displayName,
        })
      : t('calendar.demo.metaTime', { time: meetingTime });

    const homeworkDate = now.getHours() < 18 ? today : addDays(today, 1);
    const homeworkPeople = children.slice(0, 2).map(toPerson);
    const homeworkNames = joinNames(homeworkPeople);
    const homeworkTime = formatClock(at(homeworkDate, 17));
    const homeworkMeta = homeworkPeople.length
      ? t('calendar.demo.meta', {
          time: homeworkTime,
          names: homeworkNames,
        })
      : t('calendar.demo.metaTime', { time: homeworkTime });

    const featured: FamilyEvent = {
      id: 'calendar-trip',
      kind: 'trip',
      title: t('calendar.featured.title'),
      description: tripDescription,
      startsAt: at(saturday, 9),
      endsAt: at(sunday, 18),
      participants: tripPeople,
      photo: TRIP_PHOTO,
      reminderAt: at(addDays(saturday, -1), 18),
      featured: true,
    };

    const cinema: FamilyEvent = {
      id: 'calendar-cinema',
      kind: 'cinema',
      title: t('calendar.demo.cinema'),
      description: t('calendar.demo.metaTime', { time: cinemaTime }),
      startsAt: at(saturday, 16),
      endsAt: at(saturday, 18),
      participants: cinemaPeople,
    };

    const doctor: FamilyEvent = {
      id: 'calendar-doctor',
      kind: 'doctor',
      title: doctorTitle,
      description: t('calendar.demo.metaTime', { time: doctorTime }),
      startsAt: at(thursday, 17),
      endsAt: at(thursday, 18),
      participants: doctorPeople,
    };

    const meeting: FamilyEvent = {
      id: 'calendar-meeting',
      kind: 'meeting',
      title: t('calendar.demo.meeting'),
      description: t('calendar.demo.metaTime', { time: meetingTime }),
      startsAt: at(thursday, 18, 30),
      endsAt: at(thursday, 19, 30),
      participants: firstParent ? [toPerson(firstParent)] : [],
    };

    const homework: FamilyEvent = {
      id: 'calendar-homework',
      kind: 'homework',
      title: t('calendar.demo.homework'),
      description: t('calendar.demo.metaTime', { time: homeworkTime }),
      startsAt: at(homeworkDate, 17),
      endsAt: at(homeworkDate, 18),
      participants: homeworkPeople,
    };

    const upcoming = [cinema, doctor, meeting, homework].sort(
      (a, b) => a.startsAt.getTime() - b.startsAt.getTime(),
    );

    return {
      today,
      events: [featured, ...upcoming],
      featured,
      upcoming,
      cinemaMeta,
      doctorMeta,
      meetingMeta,
      homeworkMeta,
      cinemaDay: formatWeekdayShort(at(saturday, 16)),
      doctorDay: formatMonthDay(at(thursday, 17)),
      meetingWeekday: formatWeekdayShort(at(thursday, 18, 30)),
      meetingDay: thursday.getDate(),
      homeworkWeekday: formatWeekdayShort(at(homeworkDate, 17)),
      homeworkDay: homeworkDate.getDate(),
    };
  }, [members, now, t, today]);
}

import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FAMILY_EVENT_KIND_LABELS,
  type FamilyEvent,
  type FamilyEventResponse,
  familyEventCover,
} from '@entities/family-event';
import {
  useFamilyEvent,
  useRespondFamilyEvent,
  useCancelFamilyEvent,
} from '@features/family-event';
import { isApiError } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import {
  formatClock,
  formatDate,
  formatMonthDay,
  isSameDay,
  showToast,
} from '@shared/lib';
import { theme, useTheme } from '@shared/theme';
import {
  ApiImage,
  BottomSheet,
  Icon,
  LetterAvatar,
  ScreenHeader,
} from '@shared/ui';
import { styles } from './family-event.styled';

/** Минуты до начала, для которых есть подпись в форме. */
const REMINDER_LEADS = [60, 180, 1440, 4320, 10080] as const;

const REMINDER_KEYS = {
  60: 'calendar.reminderOptions.h1',
  180: 'calendar.reminderOptions.h3',
  1440: 'calendar.reminderOptions.d1',
  4320: 'calendar.reminderOptions.d3',
  10080: 'calendar.reminderOptions.w1',
} as const;

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

/** «Сб 21 — Вс 22 ноября»: дни недели и месяц без лишних повторов. */
function dateRangeLabel(start: Date, end: Date) {
  if (isSameDay(start, end)) {
    return capitalize(
      formatDate(start, { weekday: 'short', day: 'numeric', month: 'long' }),
    );
  }
  const sameMonth =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth();
  if (sameMonth) {
    return `${capitalize(
      formatDate(start, { weekday: 'short', day: 'numeric' }),
    )} — ${capitalize(
      formatDate(end, { weekday: 'short', day: 'numeric', month: 'long' }),
    )}`;
  }
  return `${capitalize(
    formatDate(start, { weekday: 'short', day: 'numeric', month: 'short' }),
  )} — ${capitalize(
    formatDate(end, { weekday: 'short', day: 'numeric', month: 'short' }),
  )}`;
}

function timeRangeLabel(event: FamilyEvent) {
  if (event.startsAt.getTime() === event.endsAt.getTime()) {
    return formatClock(event.startsAt);
  }
  return `${formatClock(event.startsAt)}–${formatClock(event.endsAt)}`;
}

function reminderLeadKey(start: Date, reminderAt: Date) {
  const minutes = Math.round((start.getTime() - reminderAt.getTime()) / 60_000);
  return REMINDER_LEADS.find((lead) => lead === minutes);
}

/**
 * Карточка события (`/family-event/[id]`): фото, название и дата, кто едет,
 * описание, напоминание и ответ «Я еду / Я не еду». Данные приходят из
 * GET /families/:familyId/events/:eventId.
 */
export function FamilyEventPage() {
  const { mode } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, year } = useLocalSearchParams<{ id: string; year?: string }>();
  const eventYear = year && /^\d{4}$/.test(year) ? Number(year) : null;
  const { event, isPending, isError, error, refetch } = useFamilyEvent(
    id ?? null,
    eventYear,
  );
  const respondEvent = useRespondFamilyEvent();
  const cancelEvent = useCancelFamilyEvent();
  const [responding, setResponding] = useState(false);

  const back = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/calendar');
    }
  };

  if (isPending) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.missingHeader}>
          <ScreenHeader title={t('calendar.title')} onBack={back} />
        </View>
        <ActivityIndicator
          style={styles.loading}
          color={theme.colors.blueInk}
        />
      </View>
    );
  }

  if (!event) {
    const notFound = isApiError(error) && [403, 404].includes(error.status);
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.missingHeader}>
          <ScreenHeader title={t('calendar.title')} onBack={back} />
        </View>
        <View style={styles.empty}>
          {isError && !notFound ? (
            <>
              <Text style={styles.emptyText}>{t('calendar.loadError')}</Text>
              <Pressable accessibilityRole="button" onPress={() => refetch()}>
                <Text style={styles.emptyLink}>{t('calendar.retry')}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.emptyText}>
                {t('calendar.eventNotFound')}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.replace('/calendar')}
              >
                <Text style={styles.emptyLink}>
                  {t('calendar.backToCalendar')}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    );
  }

  const kindLabel = t(FAMILY_EVENT_KIND_LABELS[event.kind]);
  const dateLine =
    event.repeat === 'annual'
      ? `${kindLabel} · ${t('calendar.annualDateLine', {
          date: formatDate(event.startsAt, {
            day: 'numeric',
            month: 'long',
          }),
        })} · ${timeRangeLabel(event)}`
      : `${kindLabel} · ${t('calendar.rangeLine', {
          range: dateRangeLabel(event.startsAt, event.endsAt),
          time: timeRangeLabel(event),
        })}`;

  const leadKey = event.reminderAt
    ? (event.reminderLeadMinutes ??
      reminderLeadKey(event.startsAt, event.reminderAt))
    : null;
  const customLead = (minutes: number) => {
    if (minutes % 10080 === 0) {
      return t('calendar.reminderCustomWeeks', { count: minutes / 10080 });
    }
    if (minutes % 1440 === 0) {
      return t('calendar.reminderCustomDays', { count: minutes / 1440 });
    }
    if (minutes % 60 === 0) {
      return t('calendar.reminderCustomHours', { count: minutes / 60 });
    }
    return t('calendar.reminderCustomMinutes', { count: minutes });
  };
  const dailyMinute = event.reminderDailyMinute;
  const dailyTime =
    dailyMinute == null
      ? undefined
      : `${String(Math.floor(dailyMinute / 60)).padStart(2, '0')}:${String(dailyMinute % 60).padStart(2, '0')}`;
  const reminderText =
    event.reminderDailyDays != null && dailyTime != null
      ? event.reminderDailyDays === 0
        ? t('calendar.reminderOnEventDay', { time: dailyTime })
        : t('calendar.reminderDailySummary', {
            days: event.reminderDailyDays,
            time: dailyTime,
          })
      : event.reminderAt
        ? [
            leadKey
              ? leadKey in REMINDER_KEYS
                ? t(REMINDER_KEYS[leadKey as keyof typeof REMINDER_KEYS])
                : customLead(leadKey)
              : null,
            `${formatMonthDay(event.reminderAt)}, ${formatClock(event.reminderAt)}`,
          ]
            .filter(Boolean)
            .join(' · ')
        : '';

  const respond = (response: FamilyEventResponse) => {
    respondEvent.mutate(
      { eventId: event.id, response },
      {
        onSuccess: () => {
          setResponding(false);
          showToast(t('calendar.responseSaved'));
        },
        onError: () => showToast(t('calendar.responseError')),
      },
    );
  };

  const confirmCancel = () => {
    Alert.alert(
      t('calendar.cancelEventTitle'),
      t('calendar.cancelEventMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('calendar.cancelEvent'),
          style: 'destructive',
          onPress: () =>
            cancelEvent.mutate(event.id, {
              onSuccess: () => {
                showToast(t('calendar.eventCancelled'));
                router.replace('/calendar');
              },
              onError: () => showToast(t('calendar.cancelError')),
            }),
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        bounces={false}
        overScrollMode="never"
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <ApiImage
            retainInMemory={false}
            source={familyEventCover(event, mode)}
            resizeMode="cover"
            style={[styles.heroImage, !event.photo && styles.heroTemplate]}
          />
          <LinearGradient
            colors={[
              'rgba(8, 16, 32, 0.48)',
              'rgba(8, 16, 32, 0.08)',
              'rgba(8, 16, 32, 0.08)',
              'rgba(8, 16, 32, 0.86)',
            ]}
            locations={[0, 0.35, 0.58, 1]}
            style={styles.heroGradient}
          />

          <View style={[styles.heroTop, { top: insets.top + 8 }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
              onPress={back}
              style={styles.round}
            >
              <Icon name="arrow-left" size={20} color={theme.colors.white} />
            </Pressable>
            {event.canEdit && (
              <View style={styles.heroActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('calendar.editTitle')}
                  onPress={() =>
                    router.push({
                      pathname: '/edit-family-event',
                      params: {
                        id: event.id,
                        ...(event.repeat === 'annual'
                          ? { year: String(event.startsAt.getFullYear()) }
                          : {}),
                      },
                    })
                  }
                  style={styles.round}
                >
                  <Icon name="pencil" size={17} color={theme.colors.white} />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('calendar.cancelEvent')}
                  accessibilityState={{ disabled: cancelEvent.isPending }}
                  disabled={cancelEvent.isPending}
                  onPress={confirmCancel}
                  style={styles.round}
                >
                  <Icon name="trash" size={17} color={theme.colors.white} />
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <Text style={styles.heroDate}>{dateLine}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>{t('calendar.whoGoes')}</Text>
              <Text style={styles.count}>
                {t('calendar.peopleCount', {
                  count: event.participants.length,
                })}
              </Text>
            </View>
            {event.participants.length > 0 && (
              <View style={styles.people}>
                {event.participants.map((person) => (
                  <View key={person.id} style={styles.person}>
                    <LetterAvatar
                      source={person.avatar}
                      name={person.name}
                      tone="blue"
                      letterSize={13}
                      style={styles.avatar}
                    />
                    <Text style={styles.personName} numberOfLines={1}>
                      {person.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {!!event.description && (
            <Text style={styles.description}>{event.description}</Text>
          )}

          {!!reminderText && (
            <View style={styles.reminder}>
              <View style={styles.bell}>
                <Icon name="bell" size={16} color={theme.colors.reviewText} />
              </View>
              <View style={styles.reminderBody}>
                <Text style={styles.reminderTitle}>
                  {t('calendar.reminderTitle')}
                </Text>
                <Text style={styles.reminderText}>{reminderText}</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{t('calendar.everyone')}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: respondEvent.isPending }}
          disabled={respondEvent.isPending}
          onPress={() => setResponding(true)}
          style={styles.action}
        >
          <Text style={styles.actionText}>
            {event.response
              ? t('calendar.changeResponse')
              : t('calendar.respond')}
          </Text>
        </Pressable>
      </View>

      <BottomSheet visible={responding} onClose={() => setResponding(false)}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{t('calendar.responseTitle')}</Text>
          {(
            [
              { value: 'going', label: t('calendar.responseGoing') },
              {
                value: 'not_going',
                label: t('calendar.responseNotGoing'),
              },
            ] as const
          ).map((option) => {
            const selected = event.response === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{
                  selected,
                  disabled: respondEvent.isPending,
                }}
                disabled={respondEvent.isPending}
                onPress={() => respond(option.value)}
                style={[styles.responseRow, selected && styles.responseRowOn]}
              >
                <Text
                  style={[
                    styles.responseText,
                    selected && styles.responseTextOn,
                  ]}
                >
                  {option.label}
                </Text>
                {selected && (
                  <Icon name="check" size={17} color={theme.colors.childInk} />
                )}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );
}

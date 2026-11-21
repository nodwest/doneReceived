import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCurrentFamily, useFamilyMembers } from '@entities/family';
import {
  EventPersonChip,
  FAMILY_EVENT_KIND_LABELS,
  FeaturedEventCard,
  removeFamilyEventPhoto,
  uploadFamilyEventPhoto,
  type FamilyEvent,
  type FamilyEventKind,
  type FamilyEventPerson,
  type FamilyEventRepeat,
} from '@entities/family-event';
import { authorizedImage, syncData } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import {
  choosePhotos,
  deviceTimeZone,
  formatDate,
  showToast,
  type PickedPhoto,
} from '@shared/lib';
import { theme } from '@shared/theme';
import { DateTimePickerSheet, Icon, Input, RoundButton } from '@shared/ui';
import { useSaveFamilyEvent } from '../model/use-save-family-event';
import { styles } from './family-event-form.styled';

const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const KIND_OPTIONS = ['trip', 'event', 'holiday'] as const;
const REMINDER_OPTIONS = [
  { minutes: null, key: 'none' },
  { minutes: 60, key: 'h1' },
  { minutes: 180, key: 'h3' },
  { minutes: 1440, key: 'd1' },
  { minutes: 4320, key: 'd3' },
  { minutes: 10080, key: 'w1' },
] as const;

type FamilyEventFormProps = {
  /** Событие для правки; null — создаём новое. */
  event: FamilyEvent | null;
  onClose: () => void;
  onSaved: (event: FamilyEvent) => void;
};

/** Следующее наступление ежегодной даты: прошедший день переносится на год. */
const nextAnnual = (date: Date, now: Date) => {
  const next = new Date(date);
  if (next.getTime() <= now.getTime()) {
    next.setFullYear(next.getFullYear() + 1);
  }
  return next;
};

const defaultStart = () => {
  const date = new Date();
  date.setSeconds(0, 0);
  date.setMinutes(0);
  date.setHours(date.getHours() + 1);
  if (date.getHours() < 9) date.setHours(9);
  return date;
};

/**
 * Напоминание не должно оказаться в прошлом: для события через час «за день»
 * бессмысленно. Явно выбираем ближайший будущий вариант или «без напоминания».
 */
const defaultReminderLead = (start: Date, now: Date) => {
  const diff = start.getTime() - now.getTime();
  if (diff >= 10080 * MINUTE_MS) return 10080;
  if (diff >= 1440 * MINUTE_MS) return 1440;
  if (diff >= 180 * MINUTE_MS) return 180;
  if (diff >= 60 * MINUTE_MS) return 60;
  return null;
};

const createRequestId = () =>
  `calendar-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const timeLabel = (date: Date) =>
  formatDate(date, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });

/**
 * Форма события: превью, разовое/ежегодное, название, даты, описание,
 * участники и напоминание. Сохраняет событие в локальный стор: серверного
 * календаря пока нет.
 */
export function FamilyEventForm({
  event,
  onClose,
  onSaved,
}: FamilyEventFormProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const familyId = useCurrentFamily()?.id ?? null;
  const { data: members = [] } = useFamilyMembers(familyId);
  const saveEvent = useSaveFamilyEvent();
  const queryClient = useQueryClient();
  const [now] = useState(() => new Date());
  const [timezone] = useState(() => event?.timezone ?? deviceTimeZone());
  const [initialStart] = useState(defaultStart);
  const [clientRequestId] = useState(createRequestId);
  const [title, setTitle] = useState(event?.title ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [kind, setKind] = useState<FamilyEventKind>(event?.kind ?? 'event');
  /** Локально выбранная обложка: загружается после сохранения события. */
  const [cover, setCover] = useState<PickedPhoto | null>(null);
  const [coverRemoved, setCoverRemoved] = useState(false);
  const [repeat, setRepeat] = useState<FamilyEventRepeat>(
    event?.repeat ?? 'once',
  );
  const [startsAt, setStartsAt] = useState(
    () => event?.startsAt ?? initialStart,
  );
  const [endsAt, setEndsAt] = useState(
    () => event?.endsAt ?? new Date(initialStart.getTime() + 3 * HOUR_MS),
  );
  const [participants, setParticipants] = useState<FamilyEventPerson[] | null>(
    event ? event.participants : null,
  );
  const [reminderLead, setReminderLead] = useState<number | null>(() =>
    event
      ? (event.reminderLeadMinutes ?? null)
      : defaultReminderLead(initialStart, now),
  );
  const [picker, setPicker] = useState<'start' | 'end' | null>(null);

  // Год вперёд достаточно и для разового, и для ежегодного события: годовщина
  // повторяется сама. Пять лет давали ~1 800 строк в колесе и фриз на Android.
  const maxDate = useMemo(
    () =>
      new Date(
        now.getFullYear() + 1,
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
      ),
    [now],
  );

  const familyPeople = useMemo<FamilyEventPerson[]>(
    () =>
      members.map((member) => ({
        id: member.userId,
        name: member.displayName,
        avatar: member.avatarUrl ? authorizedImage(member.avatarUrl) : null,
      })),
    [members],
  );

  const availablePeople = useMemo(() => {
    const people = new Map<string, FamilyEventPerson>();
    familyPeople.forEach((person) => people.set(person.id, person));
    (event?.participants ?? []).forEach((person) =>
      people.set(person.id, person),
    );
    return [...people.values()];
  }, [event?.participants, familyPeople]);

  const selectedParticipants = participants ?? familyPeople;

  const effectiveStart =
    repeat === 'annual' ? nextAnnual(startsAt, now) : startsAt;
  const effectiveEnd = repeat === 'annual' ? effectiveStart : endsAt;
  const reminderAt =
    reminderLead === null
      ? undefined
      : new Date(effectiveStart.getTime() - reminderLead * 60_000);

  const previewEvent: FamilyEvent = {
    id: event?.id ?? 'preview',
    kind,
    title: title.trim() || t('calendar.createTitle'),
    description: description.trim() || t('calendar.descriptionPlaceholder'),
    startsAt: effectiveStart,
    endsAt: effectiveEnd,
    repeat,
    timezone,
    participants: selectedParticipants,
    photo: cover ? { uri: cover.uri } : coverRemoved ? undefined : event?.photo,
    reminderAt,
    reminderLeadMinutes: reminderLead ?? undefined,
    response: event?.response,
    canEdit: true,
    featured: event?.featured,
  };

  const canSave =
    !!familyId &&
    title.trim().length > 0 &&
    selectedParticipants.length > 0 &&
    !saveEvent.isPending;

  const changeRepeat = (next: FamilyEventRepeat) => {
    setRepeat(next);
    if (next === 'annual') {
      setEndsAt(startsAt);
    } else if (startsAt.getTime() <= now.getTime()) {
      const nextStart = nextAnnual(startsAt, now);
      setStartsAt(nextStart);
      setEndsAt(new Date(nextStart.getTime() + 3 * HOUR_MS));
    } else if (endsAt.getTime() <= startsAt.getTime()) {
      setEndsAt(new Date(startsAt.getTime() + 3 * HOUR_MS));
    }
  };

  const togglePerson = (person: FamilyEventPerson) => {
    setParticipants((current) => {
      const list = current ?? familyPeople;
      return list.some((item) => item.id === person.id)
        ? list.filter((item) => item.id !== person.id)
        : [...list, person];
    });
  };

  const openPicker = (next: 'start' | 'end') => setPicker(next);

  const confirmPicker = (date: Date) => {
    if (picker === 'end') {
      setEndsAt(date);
    } else {
      setStartsAt(date);
      if (repeat === 'annual') {
        setEndsAt(date);
      } else if (endsAt.getTime() <= date.getTime()) {
        setEndsAt(new Date(date.getTime() + 3 * HOUR_MS));
      }
    }
    setPicker(null);
  };

  /** Галерея обложки: иконка на карточке-превью. */
  const pickCover = async () => {
    const [picked] = await choosePhotos('library', 1);
    if (!picked) return;
    setCover(picked);
    setCoverRemoved(false);
  };

  const removeCover = () => {
    setCover(null);
    setCoverRemoved(true);
  };

  const save = () => {
    if (!familyId) {
      showToast(t('calendar.formInvalid'));
      return;
    }
    if (!canSave) {
      showToast(t('calendar.formInvalid'));
      return;
    }
    saveEvent.mutate(
      {
        eventId: event?.id,
        payload: {
          title: title.trim(),
          description: description.trim(),
          startsAt: effectiveStart,
          endsAt: effectiveEnd,
          timezone,
          repeat,
          kind,
          reminderLeadMinutes: reminderLead,
          participants: selectedParticipants.map((person) => person.id),
          clientRequestId: event ? undefined : clientRequestId,
        },
      },
      {
        onSuccess: async (saved) => {
          // Обложка грузится после события: ей нужен id. Если она не
          // загрузилась, событие всё равно сохранено — сообщаем и закрываем.
          if (familyId && (cover || coverRemoved)) {
            try {
              if (cover)
                await uploadFamilyEventPhoto(familyId, saved.id, cover);
              else await removeFamilyEventPhoto(familyId, saved.id);
              await syncData(queryClient, 'calendar-changed');
            } catch {
              showToast(t('calendar.photoError'));
            }
          }
          onSaved(saved);
        },
        onError: () => showToast(t('calendar.saveError')),
      },
    );
  };

  const headerAction = canSave
    ? styles.headerAction
    : styles.headerActionDisabled;
  const dateValue =
    repeat === 'annual'
      ? formatDate(effectiveStart, { day: 'numeric', month: 'long' })
      : timeLabel(startsAt);
  const endValue = timeLabel(endsAt);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <RoundButton
            icon="close"
            size="sm"
            accessibilityLabel={t('common.close')}
            onPress={onClose}
          />
          <Text style={styles.headerTitle}>
            {event ? t('calendar.editTitle') : t('calendar.createTitle')}
          </Text>
          <View style={styles.headerSide}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSave }}
              disabled={!canSave}
              onPress={save}
            >
              <Text style={headerAction}>{t('calendar.save')}</Text>
            </Pressable>
          </View>
        </View>

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            bounces={false}
            overScrollMode="never"
            style={styles.scroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.preview}>
              <FeaturedEventCard
                event={previewEvent}
                onPickPhoto={pickCover}
                onRemovePhoto={removeCover}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('calendar.repeatLabel')}</Text>
              <View style={styles.seg}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: repeat === 'once' }}
                  style={[
                    styles.segItem,
                    repeat === 'once' && styles.segItemOn,
                  ]}
                  onPress={() => changeRepeat('once')}
                >
                  <Text
                    style={[
                      styles.segText,
                      repeat === 'once' && styles.segTextOn,
                    ]}
                  >
                    {t('calendar.once')}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: repeat === 'annual' }}
                  style={[
                    styles.segItem,
                    repeat === 'annual' && styles.segItemOn,
                  ]}
                  onPress={() => changeRepeat('annual')}
                >
                  <Text
                    style={[
                      styles.segText,
                      repeat === 'annual' && styles.segTextOn,
                    ]}
                  >
                    {t('calendar.annual')}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('calendar.titleLabel')}</Text>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder={t('calendar.titlePlaceholder')}
                placeholderTextColor={theme.colors.placeholder}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('calendar.kindLabel')}</Text>
              <View style={styles.reminderOptions}>
                {KIND_OPTIONS.map((option) => {
                  const selected = kind === option;
                  return (
                    <Pressable
                      key={option}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      style={[
                        styles.reminderOption,
                        selected && styles.reminderOptionOn,
                      ]}
                      onPress={() => setKind(option)}
                    >
                      <Text
                        style={[
                          styles.reminderText,
                          selected && styles.reminderTextOn,
                        ]}
                      >
                        {t(FAMILY_EVENT_KIND_LABELS[option])}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                {repeat === 'annual'
                  ? t('calendar.dateLabel')
                  : t('calendar.startLabel')}
              </Text>
              <View style={styles.dateRow}>
                <Pressable
                  accessibilityRole="button"
                  style={styles.dateField}
                  onPress={() => openPicker('start')}
                >
                  <View style={styles.dateIcon}>
                    <Icon
                      name="calendar"
                      size={17}
                      color={theme.colors.childInk}
                    />
                  </View>
                  <View style={styles.dateBody}>
                    <Text style={styles.dateLabel}>
                      {repeat === 'annual'
                        ? t('calendar.dateLabel')
                        : t('calendar.startLabel')}
                    </Text>
                    <Text style={styles.dateValue}>{dateValue}</Text>
                    {repeat === 'annual' && (
                      <Text style={styles.dateHint}>
                        {t('calendar.nextOccurrence', {
                          date: formatDate(effectiveStart, {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }),
                        })}
                      </Text>
                    )}
                  </View>
                  <Icon
                    name="chevron-right"
                    size={15}
                    color={theme.colors.grey}
                  />
                </Pressable>

                {repeat === 'once' && (
                  <Pressable
                    accessibilityRole="button"
                    style={styles.dateField}
                    onPress={() => openPicker('end')}
                  >
                    <View style={styles.dateIcon}>
                      <Icon
                        name="calendar"
                        size={17}
                        color={theme.colors.childInk}
                      />
                    </View>
                    <View style={styles.dateBody}>
                      <Text style={styles.dateLabel}>
                        {t('calendar.endLabel')}
                      </Text>
                      <Text style={styles.dateValue}>{endValue}</Text>
                    </View>
                    <Icon
                      name="chevron-right"
                      size={15}
                      color={theme.colors.grey}
                    />
                  </Pressable>
                )}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('calendar.descriptionLabel')}</Text>
              <Input
                value={description}
                onChangeText={setDescription}
                placeholder={t('calendar.descriptionPlaceholder')}
                placeholderTextColor={theme.colors.placeholder}
                multiline
                style={styles.textarea}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                {t('calendar.participantsLabel')}
              </Text>
              <View style={styles.people}>
                {availablePeople.length > 0 ? (
                  availablePeople.map((person) => (
                    <EventPersonChip
                      key={person.id}
                      person={person}
                      selected={selectedParticipants.some(
                        (item) => item.id === person.id,
                      )}
                      onPress={() => togglePerson(person)}
                    />
                  ))
                ) : (
                  <Text style={styles.emptyPeople}>
                    {t('calendar.noFamilyMembers')}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('calendar.reminderLabel')}</Text>
              <View style={styles.reminderOptions}>
                {REMINDER_OPTIONS.map((option) => {
                  const selected = reminderLead === option.minutes;
                  return (
                    <Pressable
                      key={option.key}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      style={[
                        styles.reminderOption,
                        selected && styles.reminderOptionOn,
                      ]}
                      onPress={() => setReminderLead(option.minutes)}
                    >
                      <Text
                        style={[
                          styles.reminderText,
                          selected && styles.reminderTextOn,
                        ]}
                      >
                        {t(`calendar.reminderOptions.${option.key}`)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('calendar.visibilityLabel')}</Text>
              <View style={styles.visibility}>
                <View style={styles.eye}>
                  <Icon name="eye" size={16} color={theme.colors.childInk} />
                </View>
                <Text style={styles.visibilityTitle}>
                  {t('calendar.allFamily')}
                </Text>
                {availablePeople.length > 0 && (
                  <Text style={styles.visibilityHint}>
                    {t('calendar.peopleCount', {
                      count: availablePeople.length,
                    })}
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>

          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, 12) },
            ]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSave }}
              disabled={!canSave}
              onPress={save}
              style={[styles.save, !canSave && styles.saveDisabled]}
            >
              <Text style={styles.saveText}>
                {event ? t('calendar.saveAction') : t('calendar.createAction')}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>

      <DateTimePickerSheet
        visible={picker !== null}
        value={picker === 'end' ? endsAt : effectiveStart}
        minimumDate={picker === 'end' ? startsAt : now}
        maximumDate={maxDate}
        tone="blue"
        title={
          picker === 'end'
            ? t('calendar.endLabel')
            : repeat === 'annual'
              ? t('calendar.dateLabel')
              : t('calendar.startLabel')
        }
        onConfirm={confirmPicker}
        onCancel={() => setPicker(null)}
      />
    </View>
  );
}

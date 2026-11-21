import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useViewerRole } from '@entities/user';
import { useFamilyEvent } from '@features/family-event';
import { FamilyEventForm } from '@features/family-event-form';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { createStyles, theme, tracking, useTheme } from '@shared/theme';
import { ScreenHeader } from '@shared/ui';

type FamilyEventFormPageProps = {
  mode: 'create' | 'edit';
};

/** Создать событие или отредактировать существующее. */
export function CreateFamilyEventPage() {
  return <FamilyEventFormPage mode="create" />;
}

export function EditFamilyEventPage() {
  return <FamilyEventFormPage mode="edit" />;
}

export function FamilyEventFormPage({ mode }: FamilyEventFormPageProps) {
  useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const role = useViewerRole();
  const { id, year } = useLocalSearchParams<{ id?: string; year?: string }>();
  const eventYear = year && /^\d{4}$/.test(year) ? Number(year) : null;
  const { event, isPending } = useFamilyEvent(
    role === 'child' || mode !== 'edit' ? null : (id ?? null),
    eventYear,
  );

  const close = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/calendar');
    }
  };

  if (role === 'child') return <Redirect href="/calendar" />;

  if (mode === 'edit' && isPending) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ScreenHeader title={t('calendar.editTitle')} onBack={close} />
        <ActivityIndicator
          style={styles.loading}
          color={theme.colors.blueInk}
        />
      </View>
    );
  }

  if (mode === 'edit' && (!event || !event.canEdit)) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ScreenHeader title={t('calendar.editTitle')} onBack={close} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{t('calendar.eventNotFound')}</Text>
        </View>
      </View>
    );
  }

  return (
    <FamilyEventForm
      event={mode === 'edit' ? event : null}
      onClose={close}
      onSaved={(photoFailed) => {
        showToast(
          t(photoFailed ? 'calendar.photoError' : 'calendar.eventSaved'),
        );
        close();
      }}
    />
  );
}

const styles = createStyles((colors) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.prime,
    paddingHorizontal: 12,
  },
  loading: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
    textAlign: 'center',
  },
}));

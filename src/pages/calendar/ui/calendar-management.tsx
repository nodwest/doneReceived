import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import {
  cancelFamilyEvent,
  useManagedFamilyEventsQuery,
} from '@entities/family-event';
import { isApiError, syncData } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { styles } from './calendar.styled';

type Props = {
  familyId: string;
  scope: string;
  onClose: () => void;
};

export function CalendarManagement({ familyId, scope, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [history, setHistory] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cursor = history.at(-1) ?? null;
  const page = useManagedFamilyEventsQuery(familyId, scope, cursor);
  const cancel = useMutation({
    mutationFn: async (id: string) => {
      try {
        await cancelFamilyEvent(familyId, id);
      } catch (error) {
        if (!isApiError(error) || error.status !== 404) throw error;
      }
    },
    onSuccess: async () => {
      setSelectedId(null);
      setHistory([]);
      await syncData(queryClient, 'calendar-changed');
    },
  });
  const nextCursor = page.data?.nextCursor;
  const dateFormat = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
  });

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={onClose}
        style={styles.linkButton}
      >
        <Text style={styles.emptyAction}>{t('common.back')}</Text>
      </Pressable>
      <Text accessibilityRole="header" style={styles.title}>
        {t('calendar.manage')}
      </Text>
      {page.isPending && (
        <ActivityIndicator accessibilityLabel={t('common.loading')} />
      )}
      {page.isError && (
        <Pressable
          accessibilityRole="button"
          onPress={() => void page.refetch()}
          style={styles.errorCard}
        >
          <Text style={styles.errorTitle}>{t('calendar.manageLoadError')}</Text>
          <Text style={styles.errorLink}>{t('calendar.retry')}</Text>
        </Pressable>
      )}
      {!page.isError && page.data?.items.length === 0 && (
        <Text style={styles.emptyHint}>{t('calendar.manageEmpty')}</Text>
      )}
      {!page.isError &&
        page.data?.items.map((event) => (
          <View key={event.id} style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>{event.title}</Text>
            <Text style={styles.emptyHint}>
              {dateFormat.format(new Date(event.startsAt))} ·{' '}
              {t(
                event.repeat === 'annual' ? 'calendar.annual' : 'calendar.once',
              )}
            </Text>
            {selectedId === event.id ? (
              <>
                <Text style={styles.emptyHint}>
                  {t(
                    event.repeat === 'annual'
                      ? 'calendar.cancelSeriesMessage'
                      : 'calendar.cancelEventMessage',
                  )}
                </Text>
                {cancel.isError && (
                  <Text accessibilityRole="alert" style={styles.errorTitle}>
                    {t('calendar.manageCancelError')}
                  </Text>
                )}
                <View style={styles.managementActions}>
                  <Pressable
                    accessibilityRole="button"
                    disabled={cancel.isPending}
                    onPress={() => setSelectedId(null)}
                    style={styles.linkButton}
                  >
                    <Text style={styles.emptyAction}>{t('common.back')}</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{
                      disabled: cancel.isPending,
                      busy: cancel.isPending,
                    }}
                    disabled={cancel.isPending}
                    onPress={() => cancel.mutate(event.id)}
                    style={styles.linkButton}
                  >
                    <Text style={styles.errorTitle}>
                      {t('calendar.cancelEvent')}
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${t('calendar.cancelEvent')}: ${event.title}`}
                disabled={cancel.isPending}
                onPress={() => {
                  cancel.reset();
                  setSelectedId(event.id);
                }}
                style={styles.linkButton}
              >
                <Text style={styles.errorTitle}>
                  {t('calendar.cancelEvent')}
                </Text>
              </Pressable>
            )}
          </View>
        ))}
      <View style={styles.managementActions}>
        {cursor && (
          <Pressable
            accessibilityRole="button"
            disabled={cancel.isPending}
            style={styles.linkButton}
            onPress={() => {
              setSelectedId(null);
              setHistory((previous) => previous.slice(0, -1));
            }}
          >
            <Text style={styles.emptyAction}>{t('calendar.previousPage')}</Text>
          </Pressable>
        )}
        {!page.isError && nextCursor && (
          <Pressable
            accessibilityRole="button"
            disabled={cancel.isPending}
            style={styles.linkButton}
            onPress={() => {
              setSelectedId(null);
              setHistory((previous) => [...previous, nextCursor]);
            }}
          >
            <Text style={styles.emptyAction}>{t('calendar.nextPage')}</Text>
          </Pressable>
        )}
      </View>
    </>
  );
}

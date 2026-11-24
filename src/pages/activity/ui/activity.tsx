import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { useFamilyFeedHistory } from '@features/family-tasks';
import {
  FeedItem,
  feedHistoryStart,
  groupFeed,
  groupFeedByDay,
} from '@entities/activity';
import { useTranslation } from '@shared/i18n';
import { formatDayHeader } from '@shared/lib';
import { theme, useTheme } from '@shared/theme';
import { RoundButton, SegmentedFilter } from '@shared/ui';
import { styles } from './activity.styled';

/** 'all' — вся семья, иначе id ребёнка. */
const ALL = 'all';

const Separator = () => <View style={styles.separator} />;

/**
 * Лента за последние 30 дней по дням («See all» на главной): карточки те же,
 * что на главной, и раскрываются так же. У родителя — фильтр по детям,
 * пополнения кошелька видны только в All.
 */
function ActivityScreen({ viewer }: { viewer: 'parent' | 'child' }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>(ALL);
  const {
    data: events,
    familyChildren,
    isPending,
    isError,
    accessDenied,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = useFamilyFeedHistory();

  const children = viewer === 'parent' ? (familyChildren ?? []) : [];
  // Ребёнка удалили, пока он был выбран, — снова вся семья.
  const selected = children.some((child) => child.id === filter) ? filter : ALL;
  const sections = useMemo(
    () =>
      groupFeedByDay(
        groupFeed(events ?? []).filter(
          (card) => selected === ALL || card.events[0].childId === selected,
        ),
        feedHistoryStart(),
      ).map(({ date, cards }) => ({ date, data: cards })),
    [events, selected],
  );

  const retry = accessDenied ? null : (
    <Pressable
      accessibilityRole="button"
      hitSlop={12}
      onPress={() => void (hasNextPage ? fetchNextPage() : refetch())}
    >
      <Text style={styles.retry}>{t('common.retry')}</Text>
    </Pressable>
  );
  const loadingMore = isPending || hasNextPage;

  return (
    <TabScreen activeKey="home" navHidden>
      <View style={styles.header}>
        <RoundButton
          icon="arrow-left"
          accessibilityLabel={t('common.back')}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace('/')
          }
        />
        <Text style={styles.title} accessibilityRole="header" numberOfLines={1}>
          {t('activity.title')}
        </Text>
        {/* Держит место кнопки, чтобы заголовок оставался по центру. */}
        <View style={styles.headerSpacer} />
      </View>
      {/* Один ребёнок — выбирать не из кого. */}
      {children.length > 1 && (
        <View style={styles.filter}>
          <SegmentedFilter
            options={[
              { value: ALL, label: t('activity.all') },
              ...children.map((child) => ({
                value: child.id,
                label: child.displayName,
              })),
            ]}
            value={selected}
            onChange={setFilter}
            tone="child"
          />
        </View>
      )}
      <SectionList
        bounces={false}
        overScrollMode="never"
        style={styles.list}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        sections={sections}
        keyExtractor={(card) => card.key}
        renderSectionHeader={({ section }) => (
          <Text style={styles.day} accessibilityRole="header">
            {formatDayHeader(section.date)}
          </Text>
        )}
        renderItem={({ item }) => (
          <FeedItem card={item} viewer={viewer} when="clock" />
        )}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={
          <View style={styles.footer}>
            {isError ? (
              <>
                <Text style={styles.footerText}>{t('activity.loadError')}</Text>
                {retry}
              </>
            ) : loadingMore ? (
              <ActivityIndicator
                color={theme.colors.blueInk}
                accessibilityLabel={t('activity.loading')}
              />
            ) : (
              <Text style={styles.footerText}>
                {t(sections.length > 0 ? 'activity.end' : 'activity.empty')}
              </Text>
            )}
          </View>
        }
      />
    </TabScreen>
  );
}

/** Лента родителя: события всей семьи. */
export function ActivityPage() {
  useTheme();
  return <ActivityScreen viewer="parent" />;
}

/** Лента ребёнка: только его события. */
export function ChildActivityPage() {
  useTheme();
  return <ActivityScreen viewer="child" />;
}

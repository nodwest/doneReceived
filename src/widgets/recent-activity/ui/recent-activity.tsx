import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { SectionHeader } from '@shared/ui';
import { styles } from './recent-activity.styled';

type RecentActivityProps = {
  /** Пункты ленты: ActivityItem у родителя, ChildActivityItem у ребёнка. */
  children: ReactNode;
  onSeeAll?: () => void;
};

export function RecentActivity({ children, onSeeAll }: RecentActivityProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <SectionHeader
        title={t('home.recentActivity')}
        actionLabel={t('common.seeAll')}
        onAction={onSeeAll}
      />
      <View style={styles.list}>{children}</View>
    </View>
  );
}

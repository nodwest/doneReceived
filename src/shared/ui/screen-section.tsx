import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SectionHeader } from './section-header';

type ScreenSectionProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  actionColor?: string;
  children: ReactNode;
};

/** Секция экрана: заголовок со ссылкой справа и содержимое под ним. */
export function ScreenSection({
  title,
  actionLabel,
  onAction,
  actionColor,
  children,
}: ScreenSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeader
        title={title}
        actionLabel={actionLabel}
        onAction={onAction}
        actionColor={actionColor}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
});

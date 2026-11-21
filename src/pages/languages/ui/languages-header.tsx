import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './languages.styled';

/** Шапка вкладки: книга и «Английский»; справа — своя кнопка. */
export function LanguagesHeader({
  tone,
  action,
}: {
  tone: 'child' | 'parent';
  /** Кнопка справа: «?» у ребёнка, карандаш награды у родителя. */
  action?: ReactNode;
}) {
  const { t } = useTranslation();
  const parent = tone === 'parent';
  return (
    <View style={styles.header}>
      <View style={[styles.headerIcon, parent && styles.headerIconParent]}>
        <Icon
          name="book"
          size={22}
          color={parent ? theme.colors.parentInk : theme.colors.childInk}
        />
      </View>
      <View style={styles.headerText}>
        <Text style={styles.title} accessibilityRole="header">
          {t('words.title')}
        </Text>
      </View>
      {action}
    </View>
  );
}

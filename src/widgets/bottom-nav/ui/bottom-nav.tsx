import { Pressable, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@shared/i18n';
import { Icon } from '@shared/ui';
import { theme } from '@shared/theme';
import { NAV_ITEMS } from '../config/nav-items';
import { NAV_PADDING_VERTICAL, styles } from './bottom-nav.styled';

type BottomNavProps = {
  activeKey: string;
  onNavigate?: (key: string) => void;
};

export function BottomNav({ activeKey, onNavigate }: BottomNavProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(NAV_PADDING_VERTICAL, bottom) },
      ]}
    >
      {NAV_ITEMS.map(({ key, icon, href }) => {
        const active = key === activeKey;
        return (
          <Pressable
            key={key}
            style={styles.item}
            onPress={() => {
              if (onNavigate) return onNavigate(key);
              // Вкладка уже в истории (Family → Tasks → Family) — откатываемся
              // к ней, иначе она заменяет текущий экран. Подсвеченная вкладка
              // на вложенном экране (профиль из Family) так же возвращает к
              // своему корню.
              if (pathname !== href) router.dismissTo(href);
            }}
          >
            <Icon
              name={icon}
              size={24}
              color={active ? theme.colors.violet : theme.colors.grey}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {t(`nav.${key}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

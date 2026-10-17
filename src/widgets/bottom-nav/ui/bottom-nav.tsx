import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@shared/ui';
import { theme } from '@shared/theme';
import { NAV_ITEMS } from '../config/nav-items';
import { styles } from './bottom-nav.styled';

type BottomNavProps = {
  activeKey: string;
  onNavigate?: (key: string) => void;
};

export function BottomNav({ activeKey, onNavigate }: BottomNavProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(24, bottom) }]}>
      {NAV_ITEMS.map(({ key, label, icon }) => {
        const active = key === activeKey;
        return (
          <Pressable
            key={key}
            style={styles.item}
            onPress={() => onNavigate?.(key)}
          >
            <Icon
              name={icon}
              size={24}
              color={active ? theme.colors.violet : theme.colors.grey}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

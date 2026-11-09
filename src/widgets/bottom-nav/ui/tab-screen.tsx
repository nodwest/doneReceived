import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from './bottom-nav';
import { styles } from './tab-screen.styled';

type TabScreenProps = {
  activeKey: string;
  wide?: boolean;
  /** Без навбара (экран карточек): отступ снизу — под жесты системы. */
  navHidden?: boolean;
  children?: ReactNode;
};

export function TabScreen({
  activeKey,
  wide,
  navHidden,
  children,
}: TabScreenProps) {
  return (
    <View style={styles.screen}>
      <SafeAreaView
        style={[styles.container, wide && styles.containerWide]}
        edges={wide ? [] : navHidden ? ['top', 'bottom'] : ['top']}
      >
        <View style={styles.content}>{children}</View>
        {!navHidden && <BottomNav activeKey={activeKey} />}
      </SafeAreaView>
    </View>
  );
}

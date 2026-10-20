import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from './bottom-nav';
import { styles } from './tab-screen.styled';

type TabScreenProps = {
  activeKey: string;
  wide?: boolean;
  children?: ReactNode;
};

export function TabScreen({ activeKey, wide, children }: TabScreenProps) {
  return (
    <View style={styles.screen}>
      <SafeAreaView
        style={[styles.container, wide && styles.containerWide]}
        edges={wide ? [] : ['top']}
      >
        <View style={styles.content}>{children}</View>
        <BottomNav activeKey={activeKey} />
      </SafeAreaView>
    </View>
  );
}

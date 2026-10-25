import { useEffect, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../i18n';
import { theme } from '../theme';

const OPEN_MS = 280;
const CLOSE_MS = 220;
const SHEET_MARGIN = 12;

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** Максимальная высота шторки в долях высоты экрана. */
  maxHeightRatio?: number;
  children: ReactNode;
};

/** Плавающая шторка снизу со скруглёнными углами; затемнение плавно появляется. */
export function BottomSheet({
  visible,
  onClose,
  maxHeightRatio = 0.5,
  children,
}: BottomSheetProps) {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [progress] = useState(() => new Animated.Value(0));
  // Модалка остаётся смонтированной, пока идёт анимация закрытия.
  const [mounted, setMounted] = useState(visible);
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (!mounted) return;
    const animation = Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? OPEN_MS : CLOSE_MS,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished && !visible) setMounted(false);
    });
    return () => animation.stop();
  }, [visible, mounted, progress]);

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Шторка с полем ввода поднимается над клавиатурой. */}
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.backdrop,
            { opacity: progress },
          ]}
        >
          <Pressable
            accessibilityLabel={t('common.close')}
            style={styles.flex}
            onPress={onClose}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            {
              maxHeight: height * maxHeightRatio,
              marginBottom: Math.max(insets.bottom, SHEET_MARGIN),
              transform: [
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.handle} />
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  flex: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: 'rgba(26, 26, 46, 0.45)',
  },
  sheet: {
    marginHorizontal: SHEET_MARGIN,
    width: '100%',
    maxWidth: 480 - SHEET_MARGIN * 2,
    alignSelf: 'center',
    paddingTop: 8,
    borderRadius: 28,
    backgroundColor: theme.colors.white,
  },
  handle: {
    width: 40,
    height: 4,
    marginBottom: 8,
    borderRadius: 2,
    alignSelf: 'center',
    backgroundColor: theme.colors.line,
  },
});

import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { theme, tracking } from '../theme';
import { useToastStore } from '../lib/toast';

// Даём нативной модалке уехать вниз, прежде чем показывать тост.
const APPEAR_DELAY = 400;
const FADE_IN = 200;
const VISIBLE = 1500;
const FADE_OUT = 400;

export function ToastHost() {
  const id = useToastStore((state) => state.id);
  const message = useToastStore((state) => state.message);
  const hide = useToastStore((state) => state.hide);
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!message) return;

    opacity.setValue(0);
    const animation = Animated.sequence([
      Animated.delay(APPEAR_DELAY),
      Animated.timing(opacity, {
        toValue: 1,
        duration: FADE_IN,
        useNativeDriver: true,
      }),
      Animated.delay(VISIBLE),
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_OUT,
        useNativeDriver: true,
      }),
    ]);
    animation.start(({ finished }) => finished && hide());

    return () => animation.stop();
  }, [id, message, hide, opacity]);

  if (!message) return null;

  return (
    <View style={[styles.overlay, { pointerEvents: 'none' }]}>
      <Animated.View style={[styles.toast, { opacity }]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✓</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: theme.colors.ink,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.success,
  },
  badgeText: {
    fontSize: 16,
    letterSpacing: tracking(16),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  message: {
    flexShrink: 1,
    fontSize: 16,
    letterSpacing: tracking(16),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
});

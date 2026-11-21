import { Pressable } from 'react-native';
import { speak } from '../lib/speech';
import { createStyles, theme } from '@shared/theme';
import { Icon } from '@shared/ui';

type SpeakButtonProps = {
  /** Что произнести (по-английски). */
  text: string;
  accessibilityLabel: string;
  /** lg — у слова, sm — у предложения. */
  size?: 'lg' | 'sm';
  tone?: 'child' | 'parent';
};

/** Круглая кнопка с динамиком: произносит слово или предложение. */
export function SpeakButton({
  text,
  accessibilityLabel,
  size = 'lg',
  tone = 'child',
}: SpeakButtonProps) {
  const small = size === 'sm';
  const parent = tone === 'parent';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={small ? 8 : 4}
      onPress={() => speak(text)}
      style={({ pressed }) => [
        styles.button,
        small && styles.small,
        parent && styles.parent,
        pressed && styles.pressed,
      ]}
    >
      <Icon
        name="speaker"
        size={small ? 18 : 24}
        color={parent ? theme.colors.parentInk : theme.colors.childInk}
      />
    </Pressable>
  );
}

const styles = createStyles((colors) => ({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.childTint,
  },
  small: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  parent: {
    backgroundColor: colors.violetSoft,
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.94 }],
  },
}));

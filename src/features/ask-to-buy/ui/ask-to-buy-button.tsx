import { Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { styles } from './ask-to-buy-button.styled';

/**
 * Зелёная кнопка у желания, на которое уже хватает денег. Пока заглушка:
 * показывает тост, родителю ничего не уходит.
 */
export function AskToBuyButton() {
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('wishlist.askToBuy')}
      onPress={() => showToast(t('wishlist.askedToast'))}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={[theme.colors.earned, theme.colors.readyText]}
        start={{ x: 0.4, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        locations={[0, 0.7071]}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.label}>{t('wishlist.askToBuy')}</Text>
    </Pressable>
  );
}

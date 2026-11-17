import { Image, StyleSheet, View } from 'react-native';

/**
 * Бумага под содержимым карточки: white — активные задания и плитки, kraft —
 * на проверке, paid — выплаченные, missed — упущенные.
 */
export type Paper = 'white' | 'kraft' | 'paid' | 'missed';

const PAPERS = {
  white: require('../../../assets/images/paper/paper-white.jpg'),
  kraft: require('../../../assets/images/paper/paper-kraft.jpg'),
  paid: require('../../../assets/images/paper/paper-paid.jpg'),
  missed: require('../../../assets/images/paper/paper-missed.jpg'),
} as const;

type PaperTextureProps = {
  paper: Paper;
  /** Насколько видна фактура поверх белого фона карточки. */
  opacity: number;
};

/**
 * Фактура бумаги на всю карточку — первым ребёнком, под содержимым. Карточке
 * нужны белый фон, скругление и `overflow: 'hidden'`.
 */
export function PaperTexture({ paper, opacity }: PaperTextureProps) {
  return (
    <Image
      source={PAPERS[paper]}
      resizeMode="cover"
      // Без проявления на Android: бумага — часть карточки, а не картинка.
      fadeDuration={0}
      style={[styles.texture, { opacity }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}

/**
 * Держит все бумаги загруженными с запуска приложения: карточка открывается
 * сразу с фоном, без вспышки белого. Невидима и ничего не перехватывает;
 * монтируется один раз в корне приложения.
 */
export function PaperPreload() {
  return (
    <View style={styles.preload} accessibilityElementsHidden>
      {(Object.keys(PAPERS) as Paper[]).map((paper) => (
        <Image
          key={paper}
          source={PAPERS[paper]}
          resizeMode="cover"
          fadeDuration={0}
          style={styles.preloadImage}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  preload: {
    position: 'absolute',
    top: 0,
    left: -10000,
    opacity: 0,
    pointerEvents: 'none',
  },
  // Размер как у карточки: на нативе картинка декодируется под размер вида.
  preloadImage: {
    width: 360,
    height: 640,
  },
  texture: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
});

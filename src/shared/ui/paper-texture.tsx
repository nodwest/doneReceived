import { Image, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

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

// Тёмная фактура — та же мятая бумага, но переведённая в полупрозрачные
// тени и блики: она ложится поверх любого фона карточки и не светит белым.
const DARK_PAPER = require('../../../assets/images/paper/paper-dark.png');

type PaperTextureProps = {
  paper: Paper;
  /** Насколько видна фактура поверх белого фона карточки. */
  opacity: number;
};

/**
 * Фактура бумаги на всю карточку — первым ребёнком, под содержимым. Карточке
 * нужны фон `surface`, скругление и `overflow: 'hidden'`.
 */
export function PaperTexture({ paper, opacity }: PaperTextureProps) {
  // В тёмной теме бумага — готовая тёмная фактура: полупрозрачные тени
  // и блики поверх цвета карточки. Светлые листы в ней выглядели бы как
  // светлая тема, а их оттенок (крафт, зелёный) в темноте не читается.
  const { isDark } = useTheme();
  return (
    <View
      style={[styles.texture, { opacity: isDark ? 1 : opacity }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Image
        source={isDark ? DARK_PAPER : PAPERS[paper]}
        resizeMode="cover"
        // Без проявления на Android: бумага — часть карточки, а не картинка.
        fadeDuration={0}
        style={styles.image}
      />
    </View>
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
      <Image
        source={DARK_PAPER}
        resizeMode="cover"
        fadeDuration={0}
        style={styles.preloadImage}
      />
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
  // Края — с четырёх сторон, а не width/height: '100%'. Проценты Yoga считает
  // от содержимого карточки (без padding), а top/left — от её края: картинка
  // выходила меньше карточки и оставляла полосы справа и снизу. Подложка
  // растягивается по краям, а сама картинка занимает её целиком.
  texture: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

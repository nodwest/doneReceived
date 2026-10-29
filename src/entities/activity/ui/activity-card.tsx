import { Image, Text, View, type ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme';
import { styles } from './activity-item.styled';

/** pending — на проверке (тёплая), approved — подтверждено (зелёная), new — новое (голубая). */
export type ActivityTone = 'pending' | 'approved' | 'new';

type ActivityCardProps = {
  tone: ActivityTone;
  avatar: ImageSourcePropType;
  title: string;
  subtitle: string;
  amount: string;
};

const GRADIENTS = {
  pending: [theme.colors.reviewFrom, theme.colors.reviewTo],
  approved: [theme.colors.approvedFrom, theme.colors.approvedTo],
} as const;

/** Карточка события в ленте: аватар, что случилось, когда и сумма. */
export function ActivityCard({
  tone,
  avatar,
  title,
  subtitle,
  amount,
}: ActivityCardProps) {
  const content = (
    <>
      <Image source={avatar} style={styles.avatar} />
      <View style={styles.middle}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.subtitle, SUBTITLE_STYLES[tone]]}>{subtitle}</Text>
      </View>
      <Text style={[styles.reward, REWARD_STYLES[tone]]}>{amount}</Text>
    </>
  );

  // Новое задание — лёгкая голубая подложка поверх белого, как плитка вишлиста.
  if (tone === 'new') {
    return (
      <View style={[styles.container, styles.new]}>
        <LinearGradient
          colors={[theme.colors.childTint, theme.colors.childTintLight]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.fill}
        />
        {content}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={GRADIENTS[tone]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.7071]}
      style={[styles.container, styles[tone]]}
    >
      {content}
    </LinearGradient>
  );
}

const SUBTITLE_STYLES = {
  pending: null,
  approved: styles.subtitleApproved,
  new: styles.subtitleNew,
};

const REWARD_STYLES = {
  pending: styles.rewardPending,
  approved: null,
  new: styles.rewardNew,
};

import { Text, View, type ImageSourcePropType } from 'react-native';
import { PresenceBadge, type Presence } from '@entities/user';
import { HeaderAvatar, RoundButton } from '@shared/ui';
import { styles } from './profile-header.styled';

type ProfileHeaderProps = {
  name: string;
  avatar: ImageSourcePropType;
  presence: Presence;
  onBack: () => void;
};

/**
 * Шапка профиля члена семьи: назад, имя и статус «дома» по центру, аватар
 * справа (как у родителя на главной).
 */
export function ProfileHeader({
  name,
  avatar,
  presence,
  onBack,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <RoundButton
        icon="arrow-left"
        accessibilityLabel="Back"
        onPress={onBack}
      />
      <View style={styles.title}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <PresenceBadge {...presence} />
      </View>
      <HeaderAvatar source={avatar} />
    </View>
  );
}

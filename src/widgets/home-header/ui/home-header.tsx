import { Image, Text, View, type ImageSourcePropType } from 'react-native';
import { styles } from './home-header.styled';

type HomeHeaderProps = {
  greeting: string;
  name: string;
  avatar: ImageSourcePropType;
};

export function HomeHeader({ greeting, name, avatar }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>{greeting}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      <Image source={avatar} style={styles.avatar} />
    </View>
  );
}

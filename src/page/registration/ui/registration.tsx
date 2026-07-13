import { View } from 'react-native';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@app/components/ui/card';
import { Label } from '@app/components/ui/label';
import { Text } from '@app/components/ui/text';
import { Icon } from '@shared/ui/icons/icon';
import { Button } from '@app/components';
import { styles } from './registration.styled';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme/theme';
import { InputWithIcon } from '@app/components/ui/Input-with-icon/InputWithIcon';

export function Registration() {
  return (
    <Card style={styles.base}>
      <CardHeader style={styles.header}>
        <LinearGradient
          colors={[theme.colors.primeViolet, theme.colors.primeBlue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerIcon}
        >
          <Icon name="star" size={44} color={theme.colors.primarYellow} />
        </LinearGradient>
        <Text variant={'h1'}>Welcome to Kids Tascks</Text>
        <CardDescription>
          Turn everyday chores into fun rewards for the whole family.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <View className="w-full justify-center gap-4">
          <View className="gap-2">
            <Label htmlFor="Full Name">Full Name</Label>
            <InputWithIcon id="name" placeholder="Full Name" iconName="user" />
          </View>
          <View className="gap-2">
            <Label htmlFor="Email">Name</Label>
            <InputWithIcon id="email" placeholder="Email" iconName="message" />
          </View>
          <View className="gap-2">
            <Label htmlFor="Password">Email</Label>
            <InputWithIcon
              secureTextEntry={true}
              id="password"
              placeholder="Password"
              iconName="castle"
            />
          </View>
        </View>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="defaultBlue" size={'default'}>
          <Text>Subscribe</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}

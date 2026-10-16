import { View, Text, Pressable } from 'react-native';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@app/components/ui/card';
import { Label } from '@app/components/ui/label';
import { Icon } from '@shared/ui/icons/icon';
import { Button, InputWithIcon } from '@app/components';
import { styles } from './registration.styled';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme/theme';

export function Registration() {
  return (
    <Card style={styles.container}>
      <CardHeader style={styles.header}>
        <LinearGradient
          style={styles.iconWrapper}
          colors={[theme.colors.violet, theme.colors.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon name="star" size={44} color={theme.colors.yellow} />
        </LinearGradient>
        <Text style={styles.title}>Welcome to Kids Tascks</Text>
        <Text style={styles.subtitle}>
          Turn everyday chores into fun rewards for the whole family.
        </Text>
      </CardHeader>
      <CardContent>
        <View style={styles.content}>
          <View style={styles.field}>
            <Label htmlFor="Full Name" style={styles.label}>
              Full Name
            </Label>
            <InputWithIcon id="name" placeholder="Full Name" iconName="user" />
          </View>
          <View style={styles.field}>
            <Label htmlFor="Email" style={styles.label}>
              Email
            </Label>
            <InputWithIcon id="email" placeholder="Email" iconName="message" />
          </View>
          <View style={styles.field}>
            <Label htmlFor="Password" style={styles.label}>
              Email
            </Label>
            <InputWithIcon
              secureTextEntry={true}
              id="password"
              placeholder="Password"
              iconName="castle"
            />
          </View>
        </View>
      </CardContent>
      <CardFooter>
        <LinearGradient
          colors={[theme.colors.violet, theme.colors.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: `100%`,
            borderRadius: 30,
            overflow: 'hidden',
          }}
        >
          <Button variant="void" size={'default'}>
            <Text style={styles.buttontitle}>Create Account</Text>
          </Button>
        </LinearGradient>
      </CardFooter>
      <Text style={styles.subtitle}>
        Already have an account?{' '}
        <Pressable>
          <Text style={styles.linktitle}>Sign up</Text>
        </Pressable>
      </Text>
    </Card>
  );
}

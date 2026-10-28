import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, tracking } from '../theme';
import { Icon, type IconName } from './icons';

type AuthLayoutProps = {
  /** Жёлтая иконка в фиолетовом квадрате над заголовком. */
  icon: IconName;
  title: string;
  subtitle: string;
  /** Кнопка внизу экрана. */
  action: ReactNode;
  /** Строка под кнопкой («Нет аккаунта? Зарегистрироваться»). */
  footnote?: ReactNode;
  children: ReactNode;
};

/**
 * Каркас экранов онбординга: выбор роли, логин, регистрация. Иконка стоит на
 * одном отступе от верха, кнопка — на одном отступе от низа, место под
 * строкой со ссылкой держится и без неё. Поэтому при переходе между
 * экранами иконка и кнопка не прыгают. Если содержимое не влезает, экран
 * прокручивается и кнопка уходит вниз вместе с ним.
 */
export function AuthLayout({
  icon,
  title,
  subtitle,
  action,
  footnote,
  children,
}: AuthLayoutProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <LinearGradient
            style={styles.icon}
            colors={[theme.colors.violet, theme.colors.blue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name={icon} size={44} color={theme.colors.yellow} />
          </LinearGradient>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.body}>{children}</View>
        <View style={styles.footer}>
          {action}
          <View style={styles.footnote}>{footnote}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type AuthFootnoteProps = {
  text: string;
  linkLabel: string;
  href: Href;
};

/** Строка под кнопкой: серый текст и фиолетовая ссылка. */
export function AuthFootnote({ text, linkLabel, href }: AuthFootnoteProps) {
  return (
    <Text style={styles.footnoteText}>
      {text}{' '}
      <Link href={href} style={styles.link}>
        {linkLabel}
      </Link>
    </Text>
  );
}

// Высота строки под кнопкой: держим её и без ссылки (выбор роли).
const FOOTNOTE_HEIGHT = 18;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.prime,
  },
  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 88,
    height: 88,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 16px rgba(108, 92, 231, 0.25)',
  },
  title: {
    textAlign: 'center',
    fontSize: theme.fontSize.h1,
    letterSpacing: tracking(theme.fontSize.h1),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    lineHeight: 18,
    fontFamily: theme.fonts.regular,
    color: theme.colors.grey,
  },
  body: {
    marginTop: 24,
  },
  // Прижимает кнопку к низу экрана, когда содержимое короче экрана.
  footer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 16,
  },
  footnote: {
    minHeight: FOOTNOTE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footnoteText: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    lineHeight: FOOTNOTE_HEIGHT,
    fontFamily: theme.fonts.regular,
    color: theme.colors.grey,
  },
  link: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.violet,
  },
});

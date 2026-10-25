import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from '../i18n';
import { Input } from './input';
import { Icon, type IconName } from './icons';

type InputWithIconProps = React.ComponentProps<typeof Input> & {
  iconName?: IconName;
};

function InputWithIcon(prop: InputWithIconProps) {
  const { iconName, style, value, onChangeText, secureTextEntry, ...props } =
    prop;
  const { t } = useTranslation();
  const [innerValue, setInnerValue] = useState('');
  // Для паролей показываем кнопку «глазок», она переключает точки и текст.
  const [hidden, setHidden] = useState(true);

  const handleChangeText = (t: string) => {
    setInnerValue(t);
    onChangeText?.(t);
  };

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        {iconName && <Icon name={iconName} size={20} color="#9CA3AF" />}
      </View>
      <Input
        {...props}
        secureTextEntry={secureTextEntry && hidden}
        value={value ?? innerValue}
        onChangeText={handleChangeText}
        style={[styles.input, secureTextEntry && styles.inputSecure, style]}
      />
      {secureTextEntry && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hidden ? t('password.show') : t('password.hide')}
          hitSlop={8}
          onPress={() => setHidden((v) => !v)}
          style={styles.eye}
        >
          <Icon name={hidden ? 'eye' : 'eye-off'} size={20} color="#9CA3AF" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
  },
  icon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    padding: 12,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    paddingVertical: 0,
    paddingLeft: 40,
    paddingRight: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  inputSecure: {
    paddingRight: 48,
  },
  eye: {
    position: 'absolute',
    right: 0,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});

export { InputWithIcon };

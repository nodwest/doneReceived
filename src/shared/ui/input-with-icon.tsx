import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Input } from './input';
import { Icon, type IconName } from './icons';
import { cn } from '../lib/utils';

type InputWithIconProps = React.ComponentProps<typeof Input> & {
  iconName?: IconName;
};

function InputWithIcon(prop: InputWithIconProps) {
  const {
    iconName,
    className,
    value,
    onChangeText,
    secureTextEntry,
    ...props
  } = prop;
  const [innerValue, setInnerValue] = useState('');
  // Для паролей показываем кнопку «глазок», она переключает точки и текст.
  const [hidden, setHidden] = useState(true);

  const handleChangeText = (t: string) => {
    setInnerValue(t);
    onChangeText?.(t);
  };

  return (
    <View className="flex-row items-center rounded-[14] border border-input bg-background  h-14 shadow-sm shadow-black/5">
      <View className="absolute items-center justify-center mr-2 p-3">
        {iconName && <Icon name={iconName} size={20} color="#9CA3AF" />}
      </View>
      <Input
        {...props}
        secureTextEntry={secureTextEntry && hidden}
        value={value ?? innerValue}
        onChangeText={handleChangeText}
        className={cn(
          'flex-1 border-0 px-0 py-0 shadow-none bg-transparent pl-10',
          secureTextEntry && 'pr-12',
          className,
        )}
      />
      {secureTextEntry && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          hitSlop={8}
          onPress={() => setHidden((v) => !v)}
          className="absolute right-0 h-full justify-center px-4"
        >
          <Icon name={hidden ? 'eye' : 'eye-off'} size={20} color="#9CA3AF" />
        </Pressable>
      )}
    </View>
  );
}

export { InputWithIcon };

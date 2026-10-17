import { useState } from 'react';
import { View } from 'react-native';
import { Input } from './input';
import { Icon, type IconName } from './icons';
import { cn } from '../lib/utils';

type InputWithIconProps = React.ComponentProps<typeof Input> & {
  iconName?: IconName;
};

function InputWithIcon(prop: InputWithIconProps) {
  const { iconName, className, value, onChangeText, ...props } = prop;
  const [innerValue, setInnerValue] = useState('');

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
        value={value ?? innerValue}
        onChangeText={handleChangeText}
        className={cn(
          'flex-1 border-0 px-0 py-0 shadow-none bg-transparent pl-10',
          className,
        )}
      />
    </View>
  );
}

export { InputWithIcon };

import { useState } from 'react';
import { View } from 'react-native';
import { Input } from '@app/components/ui/input';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@app/lib/utils';

type InputWithIconProps = React.ComponentProps<typeof Input> & {
  iconName?: string;
};

function InputWithIcon({
  iconName,
  className,
  value,
  onChangeText,
  ...props
}: InputWithIconProps) {
  const [innerValue, setInnerValue] = useState('');

  const raw = value ?? innerValue;
  const text = typeof raw === 'string' ? raw : String(raw ?? '');
  const padding = text.length === 0 ? 10 : 3;

  const handleChangeText = (t: string) => {
    setInnerValue(t);
    onChangeText?.(t);
  };

  return (
    <View className="flex-row items-center rounded-[14] border border-input bg-background  h-14 shadow-sm shadow-black/5">
      {text.length === 0 && (
        <View className="absolute items-center justify-center mr-2 p-3">
          <Icon name={iconName} size={20} color="#9CA3AF" />
        </View>
      )}
      <Input
        {...props}
        value={value ?? innerValue}
        onChangeText={handleChangeText}
        className={cn(
          'flex-1 border-0 px-0 py-0 shadow-none bg-transparent',
          `pl-${padding}`, //TODO переделать хуйню на css
          className,
        )}
      />
    </View>
  );
}

export { InputWithIcon };

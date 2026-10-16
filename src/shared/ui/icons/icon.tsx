import React from 'react';
import { icons } from '@shared/ui/icons/index';

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  color?: string;
  size?: number;
};

export const Icon: React.FC<IconProps> = ({ name, color, size }) => {
  const IconComponent = icons[name];
  if (!IconComponent) return null;

  return <IconComponent color={color} size={size} />;
};

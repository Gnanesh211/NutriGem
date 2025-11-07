
import React from 'react';

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
}

export const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  // @ts-ignore
  return <ion-icon name={name} class={className} {...props}></ion-icon>;
};

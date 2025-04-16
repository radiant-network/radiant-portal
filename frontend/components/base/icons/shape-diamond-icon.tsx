import { ReactElement } from 'react';
import { IconType } from './types';

export default function ShapeDiamondIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill={fill} {...props}>
      <path d="M15.2929 7.29289C15.6834 7.68342 15.6834 8.31658 15.2929 8.70711L8.70711 15.2929C8.31658 15.6834 7.68342 15.6834 7.29289 15.2929L0.707106 8.70711C0.316582 8.31658 0.316583 7.68342 0.707107 7.29289L7.29289 0.707106C7.68342 0.316582 8.31658 0.316583 8.70711 0.707107L15.2929 7.29289Z" />
    </svg>
  );
}

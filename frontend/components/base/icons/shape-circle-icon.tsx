import { ReactElement } from 'react';
import { IconType } from './types';

export default function ShapeCircleIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill={fill} {...props}>
      <circle cx="7.99985" cy="8.00001" r="6.4" />
    </svg>
  );
}

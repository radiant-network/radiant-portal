import { ReactElement } from 'react';
import { IconType } from './types';

export default function ShapeTriangleDownIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill={fill} {...props}>
      <path d="M7.152 13.0432L0.956249 3.12999C0.539969 2.46394 1.01881 1.59999 1.80425 1.59999H14.1958C14.9812 1.59999 15.46 2.46395 15.0437 3.12999L8.848 13.0432C8.45633 13.6699 7.54367 13.6699 7.152 13.0432Z" />
    </svg>
  );
}

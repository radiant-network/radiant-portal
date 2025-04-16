import { ReactElement } from 'react';
import { IconType } from './types';

export default function ShapeTriangleUpIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill={fill} {...props}>
      <path d="M7.152 2.9568L0.956249 12.87C0.53997 13.5361 1.01881 14.4 1.80425 14.4H14.1958C14.9812 14.4 15.46 13.5361 15.0437 12.87L8.848 2.9568C8.45633 2.33014 7.54367 2.33014 7.152 2.9568Z" />
    </svg>
  );
}

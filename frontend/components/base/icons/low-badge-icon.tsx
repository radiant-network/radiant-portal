import { IconType } from '@/components/base/icons/types';
import { ReactElement } from 'react';

function LowBadgeIcon({ size = 10, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} viewBox="0 0 10 10" width={size} fill={fill} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 9.00012L0 1.00012H10L5 9.00012Z" />
    </svg>
  );
}

export default LowBadgeIcon;

import { IconType } from '@/components/base/icons/types';
import { ReactElement } from 'react';

function HighBadgeIcon({ size = 10, ...props }: IconType): ReactElement {
  return (
    <svg
      fill="currentColor"
      height={size}
      viewBox="0 0 10 10"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M5 1.00012L0 9.00012H10L5 1.00012Z" />
    </svg>
  );
}

export default HighBadgeIcon;

import { IconType } from '@/components/base/icons/types';
import { ReactElement } from 'react';

function ModerateBadgeIcon({ size = 10, ...props }: IconType): ReactElement {
  return (
    <svg
      fill="currentColor"
      height={size}
      viewBox="0 0 10 10"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M10 5.00012L5 10.0001L0 5.00012L5 0.00012207L10 5.00012Z" />
    </svg>
  );
}

export default ModerateBadgeIcon;

import { IconType } from '@/components/base/icons/types';
import { ReactElement } from 'react';

function ModifierBadgeIcon({ size = 10, ...props }: IconType): ReactElement {
  return (
    <svg
      fill="currentColor"
      height={size}
      viewBox="0 0 10 10"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="5" cy="5.00012" r="4" />
    </svg>
  );
}

export default ModifierBadgeIcon;

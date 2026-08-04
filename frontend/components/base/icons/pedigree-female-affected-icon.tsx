import React, { type ReactElement } from 'react';

import type { IconType } from './types';

function PedigreeFemaleAffectedIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <circle cx="12" cy="12.0001" r="10" />
    </svg>
  );
}

export default PedigreeFemaleAffectedIcon;

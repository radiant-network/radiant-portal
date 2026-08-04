import React, { type ReactElement } from 'react';

import { type IconType } from './types';

function PedigreeMaleAffectedIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <path d="M22 22H2V2H22V22Z" />
    </svg>
  );
}

export default PedigreeMaleAffectedIcon;

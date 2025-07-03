import React, { ReactElement } from 'react';
import { IconType } from './types';

function PedigreeUnknownAffectedIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <path d="M24 12L12 24L0 12L12 0L24 12Z" />
    </svg>
  );
}

export default PedigreeUnknownAffectedIcon;

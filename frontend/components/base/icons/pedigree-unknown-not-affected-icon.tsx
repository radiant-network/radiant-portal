import React, { ReactElement } from 'react';
import { IconType } from './types';

function PedigreeUnknownNotAffectedIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 12L12 24L0 12L12 0L24 12ZM12 2.82843L2.82843 12L12 21.1716L21.1716 12L12 2.82843Z"
      />
    </svg>
  );
}

export default PedigreeUnknownNotAffectedIcon;

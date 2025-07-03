import React, { ReactElement } from 'react';
import { IconType } from './types';

function PedigreeMaleNotAffectedIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M4 20H20V4H4V20ZM22 22V2H2V22H22Z" />
    </svg>
  );
}

export default PedigreeMaleNotAffectedIcon;

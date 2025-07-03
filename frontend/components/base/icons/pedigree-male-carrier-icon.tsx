import React, { ReactElement } from 'react';
import { IconType } from './types';

function PedigreeMaleCarrierIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <path d="M22 22H2V2H22V22ZM4 20H20V4H4V20ZM12 8.99512C13.6596 8.99512 15.0048 10.3404 15.0049 12C15.0049 13.6596 13.6596 15.0049 12 15.0049C10.3404 15.0049 8.99512 13.6596 8.99512 12C8.99518 10.3404 10.3404 8.99512 12 8.99512Z" />
    </svg>
  );
}

export default PedigreeMaleCarrierIcon;

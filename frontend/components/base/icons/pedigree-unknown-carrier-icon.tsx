import React, { ReactElement } from 'react';
import { IconType } from './types';

function PedigreeUnknownCarrierIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <path d="M24 12L12 24L0 12L12 0L24 12ZM2.82812 12L12 21.1719L21.1719 12L12 2.82812L2.82812 12ZM12 8.99512C13.6596 8.99512 15.0048 10.3404 15.0049 12C15.0049 13.6596 13.6596 15.0049 12 15.0049C10.3404 15.0049 8.99512 13.6596 8.99512 12C8.99518 10.3404 10.3404 8.99512 12 8.99512Z" />
    </svg>
  );
}

export default PedigreeUnknownCarrierIcon;

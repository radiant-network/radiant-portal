import React, { ReactElement } from 'react';
import { IconType } from './types';

function PedigreeFemaleCarrierIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM12 8.99512C13.6596 8.99512 15.0048 10.3404 15.0049 12C15.0049 13.6596 13.6596 15.0049 12 15.0049C10.3404 15.0049 8.99512 13.6596 8.99512 12C8.99518 10.3404 10.3404 8.99512 12 8.99512Z" />
    </svg>
  );
}

export default PedigreeFemaleCarrierIcon;

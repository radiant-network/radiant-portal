import React, { ReactElement } from 'react';
import { IconType } from './types';

function PedigreeMaleDeceasedIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.6065 2.80752L21.1923 1.39331L19.5856 3H2.99991V19.5857L1.39331 21.1923L2.80752 22.6065L4.41404 21H20.9999V4.41413L22.6065 2.80752ZM17.5856 5H4.99991V17.5857L17.5856 5ZM6.41404 19L18.9999 6.41413V19H6.41404Z"
      />
    </svg>
  );
}

export default PedigreeMaleDeceasedIcon;

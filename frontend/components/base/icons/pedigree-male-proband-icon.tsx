import React, { ReactElement } from 'react';
import { IconType } from './types';

function PedigreeMaleProbandIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 19H10.9956L10.4597 21H21V3H3V13.5441L5 13.0082V5H19V19ZM10.3606 13.6423L1.43779 16.0332L3.9598 18.5552L0 22.515L1.48492 23.9999L5.44472 20.0401L7.96976 22.5652L10.3606 13.6423Z"
      />
    </svg>
  );
}

export default PedigreeMaleProbandIcon;

import React, { ReactElement } from 'react';
import { IconType } from './types';

function PedigreeUnknownProbandIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 12L12 24L10.1512 22.1512L10.749 19.9205L12 21.1716L21.1716 12L12 2.82843L2.82843 12L4.08249 13.2541L1.85178 13.8518L0 12L12 0L24 12ZM10.3606 13.6423L1.43779 16.0332L3.9598 18.5552L0 22.515L1.48492 23.9999L5.44472 20.0401L7.96976 22.5652L10.3606 13.6423Z"
      />
    </svg>
  );
}

export default PedigreeUnknownProbandIcon;

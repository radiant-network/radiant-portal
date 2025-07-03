import React, { ReactElement } from 'react';
import { IconType } from './types';

function PedigreeFemaleProbandIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 12.604 2.05656 13.195 2.15918 13.7695L4.09668 13.25C4.03278 12.8427 4 12.4252 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C11.5757 20 11.1593 19.966 10.7529 19.9023L10.2334 21.8408C10.807 21.9431 11.397 22 12 22C17.5228 22 22 17.5228 22 12ZM10.3606 13.6423L1.43779 16.0332L3.9598 18.5552L0 22.515L1.48492 23.9999L5.44472 20.0401L7.96976 22.5652L10.3606 13.6423Z"
      />
    </svg>
  );
}

export default PedigreeFemaleProbandIcon;

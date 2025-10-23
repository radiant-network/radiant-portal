import { ReactElement } from 'react';

import { IconType } from './types';

const GeneOverlapFullGeneIcon = ({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement => (
  <svg height={size} width={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill={fill} {...props}>
    <path d="M0 5.96228V7.29561H13.3333V5.96228H0Z" fill="#8F8F8F" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.66668 0L8.61601 3.11893L8.05068 3.47226L6.66668 1.25786L5.28268 3.47226L4.71735 3.11893L6.66668 0Z"
      fill="#8F8F8F"
    />
    <path d="M5.86669 3.96224H2.66669V2.62891H5.86669V3.96224Z" fill="black" />
    <path d="M7.46669 3.96224H10.6667V2.62891H7.46669V3.96224Z" fill="black" />
  </svg>
);

export default GeneOverlapFullGeneIcon;

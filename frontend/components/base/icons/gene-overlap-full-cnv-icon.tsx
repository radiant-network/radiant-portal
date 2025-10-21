import { ReactElement } from 'react';

import { IconType } from './types';

const GeneOverlapFullCNVIcon = ({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement => (
  <svg height={size} width={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill={fill} {...props}>
    <path d="M4.66667 9.99988V11.3332H11.3333V9.99988H4.66667Z" fill="#8F8F8F" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.00003 4.0376L9.94937 7.15653L9.38403 7.50986L8.00003 5.29546L6.61603 7.50986L6.0507 7.15653L8.00003 4.0376Z"
      fill="#8F8F8F"
    />
    <path d="M6.66667 7.99984H1.33333V6.6665H6.66667V7.99984Z" fill="black" />
    <path d="M9.33333 7.99984H14.6667V6.6665H9.33333V7.99984Z" fill="black" />
  </svg>
);

export default GeneOverlapFullCNVIcon;

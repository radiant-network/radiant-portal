import { ReactElement } from 'react';

import { IconType } from './types';

const GeneOverlapPartialIcon = ({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement => (
  <svg height={size} width={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill={fill} {...props}>
    <path d="M1.33334 9.99988V11.3332H8.00001V9.99988H1.33334Z" fill="#8F8F8F" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.33337 4.0376L11.2827 7.15653L10.7174 7.50986L9.33337 5.29546L7.94937 7.50986L7.38403 7.15653L9.33337 4.0376Z"
      fill="#8F8F8F"
    />
    <path d="M8.26667 7.99984H4V6.6665H8.26667V7.99984Z" fill="black" />
    <path d="M10.4 7.99984H14.6667V6.6665H10.4V7.99984Z" fill="black" />
  </svg>
);

export default GeneOverlapPartialIcon;

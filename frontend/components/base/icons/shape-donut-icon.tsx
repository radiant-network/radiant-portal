import { ReactElement } from 'react';
import { IconType } from './types';

export default function ShapeDonutIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill={fill} {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.99985 14.3998C11.5345 14.3998 14.3999 11.5344 14.3999 7.99982C14.3999 4.4652 11.5345 1.59982 7.99985 1.59982C4.46523 1.59982 1.59985 4.4652 1.59985 7.99982C1.59985 11.5344 4.46523 14.3998 7.99985 14.3998ZM8 11.9998C10.2091 11.9998 12 10.2089 12 7.9998C12 5.79066 10.2091 3.9998 8 3.9998C5.79086 3.9998 4 5.79066 4 7.9998C4 10.2089 5.79086 11.9998 8 11.9998Z"
      />
    </svg>
  );
}

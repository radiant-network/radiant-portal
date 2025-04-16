import { ReactElement } from 'react';
import { IconType } from './types';

export default function ShapeSquareIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill={fill} {...props}>
      <path d="M14.3999 13.4C14.3999 13.9523 13.9521 14.4 13.3999 14.4H2.59985C2.04757 14.4 1.59985 13.9523 1.59985 13.4V2.60001C1.59985 2.04772 2.04757 1.60001 2.59985 1.60001H13.3999C13.9521 1.60001 14.3999 2.04772 14.3999 2.60001V13.4Z" />
    </svg>
  );
}

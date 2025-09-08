import { ReactElement } from 'react';
import { IconType } from './types';

function PedigreeFemaleNotAffectedIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 20.0001C16.4183 20.0001 20 16.4184 20 12.0001C20 7.58181 16.4183 4.00009 12 4.00009C7.58172 4.00009 4 7.58181 4 12.0001C4 16.4184 7.58172 20.0001 12 20.0001ZM12 22.0001C17.5228 22.0001 22 17.5229 22 12.0001C22 6.47724 17.5228 2.00009 12 2.00009C6.47715 2.00009 2 6.47724 2 12.0001C2 17.5229 6.47715 22.0001 12 22.0001Z"
      />
    </svg>
  );
}

export default PedigreeFemaleNotAffectedIcon;

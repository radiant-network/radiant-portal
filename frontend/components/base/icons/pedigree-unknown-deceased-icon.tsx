import React, { ReactElement } from 'react';
import { IconType } from './types';

function PedigreeUnknownDeceasedIcon({ size = 16, fill = 'currentColor', ...props }: IconType): ReactElement {
  return (
    <svg height={size} width={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 24L24 12L18.7071 6.70706L22.6066 2.80752L21.1924 1.39331L17.2929 5.29285L12 0L0 12L5.29285 17.2929L1.3934 21.1923L2.80761 22.6065L6.70706 18.7071L12 24ZM8.12128 17.2929L12 21.1716L21.1716 12L17.2929 8.12128L8.12128 17.2929ZM6.70706 15.8786L15.8786 6.70706L12 2.82843L2.82843 12L6.70706 15.8786Z"
      />
    </svg>
  );
}

export default PedigreeUnknownDeceasedIcon;

import { ReactElement } from 'react';

import { IconType } from "./types";

const BetweenOperatorIcon = ({ className = '', size = 16}: IconType): ReactElement => (
    <svg
        className={className}
        fill="none"
        height={size}
        viewBox="0 0 16 16"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12.6667 2V4C9.99561 3.99951 7.99561 3.99951 6.66667 4C4.97564 4.15672 4.21747 5.0394 4.04329 6.99962L12.6667 7V9L4.0419 9.00091C4.21068 10.9648 4.95076 11.8594 6.66667 12H12.6667V14H6.66667C4 13.8205 2 12 2 8C2 4 4.04207 2.19824 6.66667 2H12.6667Z"
            fill="#6E7190"
        />
    </svg>
);
export default BetweenOperatorIcon;
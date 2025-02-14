import { ReactElement } from "react";
import { IconType } from "./types";

const NotInOperatorIcon = ({
  size = 16,
  fill = "currentColor",
  ...props
}: IconType): ReactElement => (
  <svg
    height={size}
    width={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M9.01067 1.75037L8.22842 4.66703H11.6666V6.41703H7.75942L7.44675 7.5837H11.6666V9.3337H6.97775L6.19667 12.2504H4.98917L5.77025 9.3337H2.33325V7.5837H6.23925L6.55133 6.41703H2.33325V4.66703H7.02033L7.80258 1.75037H9.01067Z" />
  </svg>
);

export default NotInOperatorIcon;

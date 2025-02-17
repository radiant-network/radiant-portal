import { ReactElement } from "react";
import { IconType } from "./types";

const ElementOperatorIcon = ({
  size = 16,
  fill = "currentColor",
  ...props
}: IconType): ReactElement => (
  <svg
    height={size}
    width={size}
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M11.0833 1.75V3.5C8.74616 3.49957 6.99616 3.49957 5.83333 3.5C4.35368 3.63713 3.69029 4.40948 3.53788 6.12466L11.0833 6.125V7.875L3.53667 7.87579C3.68434 9.59424 4.33191 10.377 5.83333 10.5H11.0833V12.25H5.83333C3.5 12.0929 1.75 10.5 1.75 7C1.75 3.5 3.53681 1.92346 5.83333 1.75H11.0833Z" />
  </svg>
);

export default ElementOperatorIcon;

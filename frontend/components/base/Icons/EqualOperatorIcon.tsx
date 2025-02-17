import { ReactElement } from "react";
import { IconType } from "./types";

const EqualOperatorIcon = ({
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
    <path d="M11.6666 7.58332V9.33332H2.33331V7.58332H11.6666ZM11.6666 4.66666V6.41666H2.33331V4.66666H11.6666Z" />
  </svg>
);

export default EqualOperatorIcon;

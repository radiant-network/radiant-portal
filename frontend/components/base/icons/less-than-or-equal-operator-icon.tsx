import { ReactElement } from "react";
import { IconType } from "./types";

const LessThanOrEqualOperatorIcon = ({
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
    <path d="M19 6.07112L8.588 9.46312L19 12.9291V16.5001L5 10.9421V8.05812L19 2.50012V6.07112Z" />
    <path d="M5 13.4401V15.9442L19 21.5022V19.0402L5 13.4401Z" />
  </svg>
);

export default LessThanOrEqualOperatorIcon;

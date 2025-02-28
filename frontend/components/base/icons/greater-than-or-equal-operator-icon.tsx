import { ReactElement } from "react";
import { IconType } from "./types";

const GreaterThanOrEqualOperatorIcon = ({
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
    <path d="M5 6.07112L15.412 9.46312L5 12.9291V16.5001L19 10.9421V8.05812L5 2.50012V6.07112Z" />
    <path d="M19 13.4401V15.9442L5 21.5022V19.0402L19 13.4401Z" />
  </svg>
);

export default GreaterThanOrEqualOperatorIcon;

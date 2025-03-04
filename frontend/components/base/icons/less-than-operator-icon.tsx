import { ReactElement } from "react";
import { IconType } from "./types";

const LessThanOperatorIcon = ({
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
    <path d="M8.588 11.9631L19 8.57112V5.00012L5 10.5581V13.4421L19 19.0001V15.4291L8.588 11.9631Z" />
  </svg>
);

export default LessThanOperatorIcon;

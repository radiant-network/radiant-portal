/**
 * At the moment, icon are directly taken from https://ant.design/components/icon (under MIT license)
 */
import * as React from "react";
import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
};

const LeftOutlinedIcon = React.forwardRef<HTMLButtonElement, IconProps>(
  ({ className }, ref) => {
    return (
      <span ref={ref} className={cn("flex", className)}>
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="left"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
        </svg>
      </span>
    );
  }
);
LeftOutlinedIcon.displayName = "LeftOutlinedIcon";

const RightOutlinedIcon = React.forwardRef<HTMLButtonElement, IconProps>(
  ({ className }, ref) => {
    return (
      <span ref={ref} className={cn("flex", className)}>
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="right"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
        </svg>
      </span>
    );
  }
);
RightOutlinedIcon.displayName = "RightOutlinedIcon";

const DoubleLeftOutlinedIcon = React.forwardRef<HTMLButtonElement, IconProps>(
  ({ className }, ref) => {
    return (
      <span ref={ref} className={cn("flex", className)}>
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="double-left"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M272.9 512l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512zm304 0l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z"></path>
        </svg>
      </span>
    );
  }
);
DoubleLeftOutlinedIcon.displayName = "DoubleLeftOutlinedIcon";

const DoubleRightOutlinedIcon = React.forwardRef<HTMLButtonElement, IconProps>(
  ({ className }, ref) => {
    return (
      <span ref={ref} className={cn("flex", className)}>
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="double-right"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1A7.98 7.98 0 00188 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5zm304 0L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1A7.98 7.98 0 00492 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z"></path>
        </svg>
      </span>
    );
  }
);
DoubleRightOutlinedIcon.displayName = "DoubleRightOutlinedIcon";

const OpenInNewIcon = React.forwardRef<HTMLButtonElement, IconProps>(
  ({ className }, ref) => {
    return (
      <span ref={ref} className={cn("flex", className)}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.25 13.75V2.25C14.25 1.97344 14.0266 1.75 13.75 1.75H2.25C1.97344 1.75 1.75 1.97344 1.75 2.25V7.875C1.75 7.94375 1.80625 8 1.875 8H2.75C2.81875 8 2.875 7.94375 2.875 7.875V2.875H13.125V13.125H8.125C8.05625 13.125 8 13.1813 8 13.25V14.125C8 14.1938 8.05625 14.25 8.125 14.25H13.75C14.0266 14.25 14.25 14.0266 14.25 13.75ZM6.63437 10.2078L7.45 11.0234C7.4666 11.04 7.48751 11.0515 7.51035 11.0567C7.53318 11.0619 7.55702 11.0607 7.57916 11.053C7.6013 11.0454 7.62085 11.0317 7.63558 11.0134C7.65031 10.9952 7.65964 10.9732 7.6625 10.95L7.99063 8.14688C8 8.06719 7.93281 7.99844 7.85156 8.00781L5.04844 8.33594C4.94531 8.34844 4.90156 8.475 4.975 8.54844L5.79375 9.36719L1.79062 13.3703C1.74219 13.4188 1.74219 13.4984 1.79062 13.5469L2.45312 14.2094C2.50156 14.2578 2.58125 14.2578 2.62969 14.2094L6.63437 10.2078Z"></path>
        </svg>
      </span>
    );
  }
);
OpenInNewIcon.displayName = "OpenInNewIcon";

const PlusOutlinedIcon = React.forwardRef<HTMLButtonElement, IconProps>(
  ({ className }, ref) => {
    return (
      <span ref={ref} className={cn("flex", className)}>
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="plus"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path>
          <path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z"></path>
        </svg>
      </span>
    );
  }
);
PlusOutlinedIcon.displayName = "PlusOutlinedIcon";

const SettingIcon = React.forwardRef<HTMLButtonElement, IconProps>(
  ({ className }, ref) => {
    return (
      <span ref={ref} className={cn("flex", className)}>
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="setting"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z"></path>
        </svg>
      </span>
    );
  }
);
SettingIcon.displayName = "SettingIcon";

const CheckOutlinedIcon = React.forwardRef<HTMLButtonElement, IconProps>(
  ({ className }, ref) => {
    return (
      <span ref={ref} className={cn("flex", className)}>
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="check"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
        </svg>
      </span>
    );
  }
);
CheckOutlinedIcon.displayName = "CheckOutlinedIcon";

const HolderIcon = React.forwardRef<HTMLButtonElement, IconProps>(
  ({ className }, ref) => {
    return (
      <span ref={ref} className={cn("flex", className)}>
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="holder"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M300 276.5a56 56 0 1056-97 56 56 0 00-56 97zm0 284a56 56 0 1056-97 56 56 0 00-56 97zM640 228a56 56 0 10112 0 56 56 0 00-112 0zm0 284a56 56 0 10112 0 56 56 0 00-112 0zM300 844.5a56 56 0 1056-97 56 56 0 00-56 97zM640 796a56 56 0 10112 0 56 56 0 00-112 0z"></path>
        </svg>
      </span>
    );
  }
);
HolderIcon.displayName = "DragHandleIcon";

export {
  LeftOutlinedIcon,
  RightOutlinedIcon,
  DoubleLeftOutlinedIcon,
  DoubleRightOutlinedIcon,
  OpenInNewIcon,
  PlusOutlinedIcon,
  SettingIcon,
  CheckOutlinedIcon,
  HolderIcon,
};

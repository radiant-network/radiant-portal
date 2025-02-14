export type IconType = Omit<
  React.SVGProps<SVGSVGElement>,
  "height" | "width"
> & {
  size: number;
};

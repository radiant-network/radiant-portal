import { baseButtonVariants } from "@/components/base/Buttons";
import { VariantProps } from "tailwind-variants";

export const buttonColors: VariantProps<typeof baseButtonVariants>["color"][] =
  ["default", "primary", "destructive", "info", "success", "warning"];

export const buttonVariants: VariantProps<
  typeof baseButtonVariants
>["variant"][] = ["filled", "outlined", "dashed", "subtle", "text", "link"];

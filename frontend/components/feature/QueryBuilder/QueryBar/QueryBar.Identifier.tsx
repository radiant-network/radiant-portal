import { cva, VariantProps } from "class-variance-authority";
import { useQueryBarContext } from "./QueryBar.Context";

const identifer = cva("w-1 rounded-s-sm", {
  variants: {
    selected: {
      true: ["bg-[--gold-6]"],
      false: ["bg-[--gray-5]"],
    },
  },
  defaultVariants: {
    selected: false,
  },
});

const QueryBarIdentifier = () => {
  const { query } = useQueryBarContext();

  return <div className={identifer({ selected: query.isActive() })} />;
};

export default QueryBarIdentifier;

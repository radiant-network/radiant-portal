import { useQueryBarContext } from "./QueryBar.Context";
import { tv } from "tailwind-variants";

const identifer = tv({
  base: "w-1 rounded-s-sm",
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

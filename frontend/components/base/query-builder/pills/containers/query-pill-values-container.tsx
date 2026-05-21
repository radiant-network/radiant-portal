import { cn } from '@/components/lib/utils';

export type QueryPillValuesContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  canExpand?: boolean;
  clickable?: boolean;
  classNameContent?: string;
};

/**
 * Visual container for QueryPillValues. Highlight with a white background
 *
 *                         ┌─────────────┐
 * ┌───────┌──────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum = [1,2, 3 >][X]      | 389K | [copy] [trash]  |
 * └───────└──────────────────────────────────────────┘─────────────────┘
 *                         └─────────────┘
 */
function QueryPillValuesContainer({
  canExpand,
  className,
  classNameContent,
  children,
  clickable,
  ...props
}: QueryPillValuesContainerProps) {
  return (
    <div
      className={cn(
        'bg-background rounded-xs pl-2 text-xs font-medium leading-5 relative',
        canExpand ? 'pr-[22px]' : 'pr-2',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'flex flex-wrap items-center',
          clickable ? 'hover:shadow-[inset_0_-4px_0_-2.5px_black] hover:cursor-pointer' : '',
          classNameContent,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default QueryPillValuesContainer;

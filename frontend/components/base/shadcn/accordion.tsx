import { createContext, useContext, useEffect, useState } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Accordion should support different mount mode in the futur
 * @see https://github.com/radix-ui/primitives/discussions/855#discussioncomment-1621945
 *
 * Added our own "lazy" mode utils further update
 */
type AccordionContextProps = {
  history: string[];
};
export const AccordionContext = createContext<AccordionContextProps>({ history: [] });

export function useAccordionContext() {
  return useContext(AccordionContext);
}

type AccordionProps = AccordionPrimitive.AccordionMultipleProps | AccordionPrimitive.AccordionSingleProps;
const Accordion = function ({ ...props }: AccordionProps) {
  const [history, setHistory] = useState<string[]>([]);

  // keep a history of all values
  useEffect(() => {
    const newHistory = [...history, ...(props.value ?? [])];
    if (!isEqual(newHistory, history)) {
      setHistory(uniq([...history, ...(props.value ?? [])]));
    }
  }, [props.value]);

  return (
    <AccordionContext value={{ history }}>
      <AccordionPrimitive.Root {...props} />
    </AccordionContext>
  );
};

const AccordionItem = function ({ className, ...props }: AccordionPrimitive.AccordionItemProps) {
  return <AccordionPrimitive.Item className={cn('border-b', className)} {...props} />;
};
AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps extends AccordionPrimitive.AccordionTriggerProps {
  chevronPlacement?: 'left' | 'right';
}
function AccordionTrigger({ className, children, chevronPlacement = 'left', ...props }: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex justify-between items-center">
      <AccordionPrimitive.Trigger className={cn('py-2 transition-all group w-full', className)} {...props}>
        <div className="flex flex-1 items-center">
          {chevronPlacement === 'left' && (
            <ChevronRight className="size-4 text-muted-foreground shrink-0 group-data-[state=open]:rotate-90 transition-transform duration-200 mr-2" />
          )}
          {children}
          {chevronPlacement === 'right' && (
            <ChevronDown className="size-4 text-muted-foreground shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200 ml-2" />
          )}
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

/**
 * forceMount props will disable animation
 * @see https://github.com/radix-ui/primitives/discussions/855#discussioncomment-1621945
 */
function AccordionContent({ className, children, ...props }: AccordionPrimitive.AccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      className={cn('overflow-hidden text-sm transition-all data-[state=open]:animate-accordion-down ', {
        'data-[state=closed]:hidden': props.forceMount,
        'data-[state=closed]:animate-accordion-up ': !props.forceMount,
      })}
      {...props}
    >
      <div className={cn('pb-2 pt-0', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

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

function AccordionContent({ className, children, ...props }: AccordionPrimitive.AccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('pb-2 pt-0', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

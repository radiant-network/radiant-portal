import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { Button } from "./button"
import { useState } from "react"
import { useI18n } from "@/components/hooks/i18n"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

type CollapsibleListProps = {
  list: any[];
  render: Function;
  limit: number;
}
function CollapsibleList({ list, render, limit }: CollapsibleListProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState<boolean>(false);

  if (list.length === 0) return;

  return (
    <>
      {list.slice(0, limit).map(e => render(e))}
      {list.length > limit && (
        <Collapsible open={open}>
          <CollapsibleContent className="flex flex-col gap-2">
            {list.slice(limit).map(e => render(e))}
          </CollapsibleContent>
          <CollapsibleTrigger>
            <Button
              className="p-0 text-sm font-medium"
              variant='link'
              onClick={() => setOpen(!open)}
            >
              {!open ? t('common.view_more') : t('common.view_less')}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      )}
    </>
  );

}

export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleList }

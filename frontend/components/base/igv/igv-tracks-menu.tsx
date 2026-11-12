import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { useI18n } from '@/components/hooks/i18n';

type IGVTracksMenuProps<Id extends string> = {
  tracks: { id: Id; name: string }[];
  shownTrackIds: Id[];
  onShownChange: (id: Id, shown: boolean) => void;
};

const IGVTracksMenu = <Id extends string>({ tracks, shownTrackIds, onShownChange }: IGVTracksMenuProps<Id>) => {
  const { t } = useI18n();

  return (
    // A modal menu blocks the pointer on the dialog too: a click on its header would then close the dialog.
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="xs">
          {t('variant.igv.public_tracks.menu')}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {tracks.map(({ id, name }) => (
          <DropdownMenuCheckboxItem
            key={id}
            checked={shownTrackIds.includes(id)}
            onCheckedChange={checked => onShownChange(id, checked)}
            // Keeps the menu open to switch several tracks.
            onSelect={event => event.preventDefault()}
          >
            {name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default IGVTracksMenu;

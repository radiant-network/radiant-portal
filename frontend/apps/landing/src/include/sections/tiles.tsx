import { ArrowRight, Cloud, Dna, Microscope, SquareArrowOutUpRight } from 'lucide-react';

import ResourceTile from '@/components/base/landing/resource-tile';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

const TILES = [
  {
    key: 'germline_variants',
    icon: <Dna />,
    buttons: [{ id: 'explore', href: '#', variant: 'default', icon: <ArrowRight /> }],
  },
  {
    key: 'cavatica',
    icon: <Cloud />,
    buttons: [
      { id: 'learn_more', href: '#', variant: 'secondary', icon: <SquareArrowOutUpRight /> },
      { id: 'login', href: '#', variant: 'outline', icon: <SquareArrowOutUpRight /> },
    ],
  },
  {
    key: 'experimental_models',
    icon: <Microscope />,
    buttons: [{ id: 'explore', href: '#', variant: 'default', icon: <ArrowRight /> }],
  },
] as const;

/** Resource tiles: Germline Variants / CAVATICA / Experimental Models. */
function Tiles() {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TILES.map(tile => (
        <ResourceTile
          key={tile.key}
          title={
            <span className="flex items-center gap-3">
              <span className="text-primary [&_svg]:size-8">{tile.icon}</span>
              {t(`landing.include.tiles.${tile.key}.title`)}
            </span>
          }
          description={t(`landing.include.tiles.${tile.key}.description`)}
          footer={tile.buttons.map(button => (
            <Button key={button.id} asChild variant={button.variant}>
              <a href={button.href}>
                {t(`landing.include.tiles.${tile.key}.buttons.${button.id}`)}
                {button.icon}
              </a>
            </Button>
          ))}
        />
      ))}
    </div>
  );
}

export default Tiles;

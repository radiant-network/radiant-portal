import { ArrowRight, Cloud, Dna, Microscope, SquareArrowOutUpRight } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/base/shadcn/card';
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
      { id: 'learn_more', href: '#', variant: 'default', icon: <SquareArrowOutUpRight /> },
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
        <Card key={tile.key} className="h-full">
          <CardHeader>
            <div className="text-primary [&_svg]:size-8">{tile.icon}</div>
            <CardTitle>{t(`landing.include.tiles.${tile.key}.title`)}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground text-sm">{t(`landing.include.tiles.${tile.key}.description`)}</p>
          </CardContent>
          <CardFooter className="justify-start gap-2">
            {tile.buttons.map(button => (
              <Button key={button.id} asChild variant={button.variant}>
                <a href={button.href}>
                  {t(`landing.include.tiles.${tile.key}.buttons.${button.id}`)}
                  {button.icon}
                </a>
              </Button>
            ))}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default Tiles;

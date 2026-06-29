import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../shadcn/card';

type ResourceTileProps = {
  title: ReactNode;
  description: ReactNode;
  footer?: ReactNode;
  className?: string;
  descriptionClassName?: string;
  style?: CSSProperties;
};

/** Resource card: title (icon/logo) + description + optional footer actions. */
function ResourceTile({ title, description, footer, className, descriptionClassName, style }: ResourceTileProps) {
  return (
    <Card className={cn('h-full', className)} style={style}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className={cn('text-muted-foreground text-sm', descriptionClassName)}>{description}</p>
      </CardContent>
      {footer && <CardFooter className="justify-start gap-2">{footer}</CardFooter>}
    </Card>
  );
}

export default ResourceTile;

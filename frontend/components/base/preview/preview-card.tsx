import { LucideIcon } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/base/shadcn/card';

type PreviewCardProps = {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

const PreviewCard = ({ icon: Icon, title, actions, children }: PreviewCardProps) => (
  <Card className="py-4 gap-4">
    <CardHeader className="px-4">
      <div className="content-center flex flex-wrap gap-2 items-center justify-between w-full">
        <div className="flex flex-col gap-1.5 items-start justify-center pr-2">
          <div className="flex gap-2 items-center w-full">
            <Icon className="size-6" />
            <h3 className="font-semibold">{title}</h3>
          </div>
        </div>
        {actions}
      </div>
    </CardHeader>
    <CardContent className="py-0 px-4 md:px-4">{children}</CardContent>
  </Card>
);

export default PreviewCard;

import { Card, CardContent, CardHeader, type CardProps, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';

type SkeletonCardProps = {
  title: string;
  rows: number;
} & CardProps;

function SkeletonCard({ title, rows, ...cardProps }: SkeletonCardProps) {
  return (
    <Card {...cardProps}>
      <CardHeader className="border-b [.border-b]:pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

export default SkeletonCard;

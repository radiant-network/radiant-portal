import { Card, CardContent } from '@/components/base/ui/card';

interface OverviewTabProps {}

function OverviewTab({}: OverviewTabProps) {
  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
      <Card className="shadow-none">
        <CardContent className="p-6">Todo</CardContent>
      </Card>
      <Card className="shadow-none col-span-1 md:col-span-2">
        <CardContent className="p-6">Todo</CardContent>
      </Card>
      <Card className="shadow-none">
        <CardContent className="p-6">Todo</CardContent>
      </Card>
      <Card className="shadow-none">
        <CardContent className="p-6">Todo</CardContent>
      </Card>
      <Card className="shadow-none">
        <CardContent className="p-6">Todo</CardContent>
      </Card>
    </div>
  );
}

export default OverviewTab;

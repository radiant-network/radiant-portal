import { Card, CardContent } from '@/components/base/ui/card';
import EntityHeader from './components/EntityHeader';

export default function App() {
  return (
    <main className="bg-muted h-full">
      <EntityHeader />
      <div className="p-6 gap-6 grid grid-cols-1 md:grid-cols-3">
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
    </main>
  );
}

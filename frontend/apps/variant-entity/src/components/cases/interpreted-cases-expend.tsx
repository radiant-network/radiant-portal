import { Badge } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { Separator } from '@/components/base/ui/separator';
import { Copy, Mars, Stethoscope, User } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface InterpretedCasesExpendProps {
  data: any; // Replace 'any' with the actual type of data if known
}

function InterpretedCasesExpend({}: InterpretedCasesExpendProps) {
  const handleCopy = useCallback(() => {
    // TODO - Implement the actual copy logic
    toast.success('Copied to clipboard');
  }, []);

  return (
    <div className="p-2">
      <div className="flex justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-8 text-muted-foreground">
            <div className="flex gap-1 items-center">
              <User size={16} /> <span className="text-sm">123456</span>
            </div>
            <div className="flex gap-1 items-center">
              <Stethoscope size={16} />
              <span className="text-sm">Jean-François Soucis</span>
            </div>
          </div>
          <div className="text-sm">
            Ce variant faux-sens se produit au niveau d'un résidu hautement conservé dans le domaine RING et a été bien
            établi comme pathogène dans plusieurs études.
          </div>
        </div>
        <div>
          <Button variant="outline" size="xs" onClick={handleCopy}>
            <Copy /> Copy
          </Button>
        </div>
      </div>
      <Separator className="mt-6 mb-4" />
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">ABHD16A</div>
          <div className="text-xs underline hover:cursor-pointer">NM_21360026</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">PM1</Badge>
          <Badge variant="outline">PM2</Badge>
          <Badge variant="outline">PM3</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">AD</Badge>
          <Badge variant="outline">XLD</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1 border rounded">
            <Mars size={14.4} />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span>PMID:</span>
          <div className="underline hover:cursor-pointer space-x-2">
            <span>23456789</span>
            <span>87656773</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterpretedCasesExpend;

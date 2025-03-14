import { Button } from '@/components/base/ui/button';
import { Card, CardContent, CardHeader } from '@/components/base/ui/card';
import { Download, SquareArrowOutUpRightIcon } from 'lucide-react';
type GermlineVariantPreviewProps = {
  data: {
    id: string;
    score: number;
    alternate: string;
    assembly_version: string;
    chromosome: string;
    dna_change: string;
    end: number;
    gene_external_reference: string[];
    hash: string;
    hgvsg: string;
    locus: string;
    max_impact_score: number;
    reference: string;
    rsnumber: string;
    start: number;
    variant_class: string;
    variant_external_reference: string;
  };
};

function GermlineVariantPreview({ data }: GermlineVariantPreviewProps) {
  console.log('data', data); //TODO: to remove

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-8">
          <Button variant="link">
            <a href="#" className="flex text-lg gap-2 items-center justify-center">
              {data.hgvsg}
              <SquareArrowOutUpRightIcon />
            </a>
          </Button>
          <Button color="primary" size="xs">
            Interpreter
          </Button>
          <Button color="primary" size="xs">
            <Download />
            Download report
          </Button>
          <Button color="primary" size="xs">
            Open IGV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <pre style={{ fontSize: '10px' }}>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

export default GermlineVariantPreview;

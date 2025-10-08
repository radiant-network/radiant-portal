import { GermlineSNVOccurrence } from '@/api/api';
import { ActionButton } from '@/components/base/buttons';
import PedigreeFemaleNotAffectedIcon from '@/components/base/icons/pedigree-female-not-affected-icon';
import PedigreeMaleNotAffectedIcon from '@/components/base/icons/pedigree-male-not-affected-icon';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { Card, CardContent, CardHeader } from '@/components/base/ui/card';
import { Separator } from '@/components/base/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/base/ui/sheet';
import { ArrowUpRight, ChevronLeft, ChevronRight, FlipVertical2, Info, TriangleIcon, Users } from 'lucide-react';
import { useState } from 'react';

import OccurrenceSheetContent from './occurrence-sheet-content';

type OccurrenceSheetProps = {
  setOpen: (value: boolean) => void;
  open: boolean;
  occurrence: GermlineSNVOccurrence;
  children?: React.ReactElement;
};

function OccurenceSheet({ occurrence, children }: OccurenceSheetProps) {
  const [open, setOpen] = useState(false);

  console.log(occurrence);

  return (
    <Sheet open={occurrence.hgvsg === 'chr10:g.100000235C>T' ? true : open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="flex flex-col sm:max-w-2xl w-full gap-4 overflow-y-auto bg-muted">
        <SheetHeader occurrence={occurrence} />
        <Separator />
        <SheetSubHeader />
        <OccurrenceCard />
        <OccurrenceSheetContent occurrence={occurrence} />
      </SheetContent>
    </Sheet>
  );
}

function SheetHeader({ occurrence }: { occurrence: GermlineSNVOccurrence }) {
  return (
    <div className="content-stretch flex flex-col gap-2 items-start relative shrink-0 w-full">
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="box-border content-center flex flex-wrap gap-6 items-center justify-between pr-8 relative w-full">
            <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
              <div className="flex flex-row items-center size-full">
                <div className="box-border content-center flex flex-wrap gap-4 items-center pr-4 relative w-full">
                  <p className="text-slate-500 shrink-0">Occurence</p>
                  <AnchorLink size="default" mono variant="secondary" className="min-w-0" external>
                    <span className="overflow-hidden text-ellipsis max-w-52">{occurrence.hgvsg}</span>
                  </AnchorLink>
                  <Badge variant="secondary" className="bg-slate-500/20 text-slate-800 border-transparent">
                    Germline
                  </Badge>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-2 items-center justify-end relative shrink-0">
              <Button variant="outline" iconOnly className="size-7 rounded-md">
                <ChevronLeft />
              </Button>
              <Button variant="outline" iconOnly className="size-7 rounded-md">
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SheetSubHeader() {
  return (
    <div className="content-center flex flex-wrap gap-4 items-center justify-between relative rounded-lg shrink-0 w-full">
      <div className="content-stretch flex gap-10 items-center relative shrink-0">
        <div className="content-stretch flex flex-col items-start justify-center relative shrink-0">
          <h4 className="text-[#07344a] font-semibold">Patient</h4>
          <div className="content-stretch flex gap-2 items-center relative shrink-0">
            <p className="text-muted-foreground font-mono">78910</p>
            <Badge variant="outline" className="bg-background">
              Proband
            </Badge>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-start justify-center relative shrink-0">
          <h4 className="text-[#07344a] font-semibold">Assay</h4>
          <div className="content-stretch flex gap-1 items-center relative shrink-0">
            <p className="text-muted-foreground font-mono">12345</p>
            <Button variant="ghost" iconOnly className="size-6">
              <Info />
            </Button>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-2 items-start relative shrink-0">
        <div className="box-border content-stretch flex items-center pr-px relative rounded-md shadow-sm shrink-0">
          <ActionButton actions={[]} onDefaultAction={() => {}} size="sm">
            View in case
            <ArrowUpRight />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

function OccurrenceCard() {
  return (
    <Card className="py-4 gap-4">
      <CardHeader className="px-4">
        <div className="content-center flex flex-wrap gap-2 items-center justify-between relative shrink-0 w-full">
          <div className="box-border content-stretch flex flex-col gap-1.5 items-start justify-center pr-2 relative shrink-0">
            <div className="content-stretch flex gap-2 items-center relative shrink-0 w-full">
              <Users className="size-6 text-[#07344a]" strokeWidth={2} />
              <h3 className="text-[#07344a] font-semibold">Occurence Details</h3>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-7 gap-1.5 px-2.5 rounded-md">
            <FlipVertical2 />
            View in IGV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="py-0 px-4 md:px-4">
        <div className="relative rounded-md shrink-0 w-full border">
          <div className="size-full">
            <div className="box-border content-start flex flex-wrap gap-20 items-start p-3 relative w-full">
              {/* Inheritance & Family Section */}
              <div className="basis-0 content-stretch flex flex-col gap-4 grow max-w-72 min-w-56 relative shrink-0">
                <DescriptionSection title="Inheritance">
                  <DescriptionRow label="Zygosity">
                    <Badge variant="outline" className="bg-white">
                      HET
                    </Badge>
                  </DescriptionRow>
                  <DescriptionRow label="Inheritance">
                    <Badge variant="outline" className="bg-white">
                      AD
                    </Badge>
                  </DescriptionRow>
                  <DescriptionRow label="Parental Origin">
                    <Badge variant="outline" className="bg-white">
                      Father
                    </Badge>
                  </DescriptionRow>
                </DescriptionSection>

                <DescriptionSection title="Family">
                  <DescriptionRow
                    label={
                      <span className="flex items-center gap-1">
                        Father's Genotype
                        <PedigreeMaleNotAffectedIcon size={13} />
                      </span>
                    }
                  >
                    <span className="font-['Geist_Mono',_monospace] text-[#07344a]">0/1</span>
                  </DescriptionRow>
                  <DescriptionRow
                    label={
                      <span className="flex items-center gap-1">
                        Mother's Genotype
                        <PedigreeFemaleNotAffectedIcon size={13} />
                      </span>
                    }
                  >
                    <span className="font-['Geist_Mono',_monospace] text-[#07344a]">0/0</span>
                  </DescriptionRow>
                </DescriptionSection>
              </div>

              {/* Metrics Section */}
              <div className="flex flex-col gap-4 grow max-w-72 min-w-56">
                <DescriptionSection title="Metrics">
                  <DescriptionRow label="Quality Depth">
                    <span className="font-['Geist_Mono',_monospace] text-[#07344a]">1.84</span>
                  </DescriptionRow>
                  <DescriptionRow label="Allele Depth ALT">
                    <span className="font-['Geist_Mono',_monospace] text-[#07344a]">10</span>
                  </DescriptionRow>
                  <DescriptionRow label="Total Depth ALT + REF">
                    <span className="font-['Geist_Mono',_monospace] text-[#07344a]">27</span>
                  </DescriptionRow>
                  <DescriptionRow label="Genotype Quality">
                    <div className="flex items-center gap-1">
                      <TriangleIcon size={13} />
                      <span className="font-['Geist_Mono',_monospace] text-[#07344a]">99</span>
                    </div>
                  </DescriptionRow>
                  <DescriptionRow label="Filter">
                    <Badge className="bg-red-400/20 text-red-700 border-transparent hover:bg-red-400/20">Fail</Badge>
                  </DescriptionRow>
                </DescriptionSection>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DescriptionSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
      <h4 className="text-[#07344a] font-semibold text-sm">{title}</h4>
      <div className="flex gap-3 items-center w-full">
        <div className="flex flex-col gap-2 items-start w-full">{children}</div>
      </div>
    </div>
  );
}

function DescriptionRow({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 w-full">
      <div className="text-muted-foreground  text-sm">{label}</div>
      <div className="flex items-center justify-end text-sm">{children}</div>
    </div>
  );
}

export default OccurenceSheet;

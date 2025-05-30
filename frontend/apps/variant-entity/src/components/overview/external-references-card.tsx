import { VariantOverview } from '@/api/api';
import { Card, CardContent, CardHeader } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { ExternalLink } from 'lucide-react';
import { ComponentProps } from 'react';

function ExternalReferencesCard({ data, ...props }: { data: VariantOverview } & ComponentProps<'div'>) {
  const { t } = useI18n();

  return (
    <Card {...props}>
      <CardHeader className="flex flex-row justify-between pb-0">
        <div className="font-semibold">{t('variantEntity.overview.externalReferences')}</div>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <a
          href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${data?.clinvar_name}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 hover:underline"
        >
          {t('variantEntity.overview.clinVar')} <ExternalLink size={12} />
        </a>
        <a
          href={`https://gnomad.broadinstitute.org/variant/${data?.locus}?dataset=gnomad_r3`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 hover:underline"
        >
          {t('variantEntity.overview.gnomAD')} <ExternalLink size={12} />
        </a>
        <a
          href={`https://www.ncbi.nlm.nih.gov/snp/${data?.rsnumber}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 hover:underline"
        >
          {t('variantEntity.overview.dbSNP')} <ExternalLink size={12} />
        </a>
      </CardContent>
    </Card>
  );
}

export default ExternalReferencesCard;

import { VariantOverview } from '@/api/api';
import { Card, CardContent, CardHeader } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { ComponentProps } from 'react';

function ExternalReferencesCard({ data, ...props }: { data: VariantOverview } & ComponentProps<'div'>) {
  const { t } = useI18n();

  return (
    <Card {...props}>
      <CardHeader className="flex flex-row justify-between pb-0">
        <div className="font-semibold">{t('variantEntity.overview.externalReferences')}</div>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <AnchorLink
          href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${data?.clinvar_name}`}
          variant="secondary"
          size="sm"
          target="_blank"
        >
          {t('variantEntity.overview.clinVar')}
        </AnchorLink>
        <AnchorLink
          href={`https://gnomad.broadinstitute.org/variant/${data?.locus}?dataset=gnomad_r3`}
          variant="secondary"
          size="sm"
          target="_blank"
        >
          {t('variantEntity.overview.gnomAD')}
        </AnchorLink>
        <AnchorLink
          href={`https://www.ncbi.nlm.nih.gov/snp/${data?.rsnumber}`}
          variant="secondary"
          size="sm"
          target="_blank"
        >
          {t('variantEntity.overview.dbSNP')}
        </AnchorLink>
      </CardContent>
    </Card>
  );
}

export default ExternalReferencesCard;

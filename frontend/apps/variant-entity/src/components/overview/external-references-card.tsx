import { VariantOverview } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Card, CardContent, CardHeader } from '@/components/base/ui/card';
import { getDbSnpUrl } from '@/components/feature/variant/utils';
import { useI18n } from '@/components/hooks/i18n';
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
          size="sm"
          href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${data?.clinvar_name}`}
          variant="secondary"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 hover:underline"
          external
        >
          {t('variantEntity.overview.clinVar')}
        </AnchorLink>
        <AnchorLink
          size="sm"
          href={`https://gnomad.broadinstitute.org/variant/${data?.locus}?dataset=gnomad_r3`}
          variant="secondary"
          target="_blank"
          rel="noreferrer"
          external
        >
          {t('variantEntity.overview.gnomAD')}
        </AnchorLink>
        {data?.rsnumber && (
          <AnchorLink
            size="sm"
            href={getDbSnpUrl(data.rsnumber)}
            variant="secondary"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:underline"
            external
          >
            {t('variantEntity.overview.dbSNP')}
          </AnchorLink>
        )}
      </CardContent>
    </Card>
  );
}

export default ExternalReferencesCard;

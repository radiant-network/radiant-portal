import { VariantOverview } from '@/api/api';
import Empty from '@/components/base/empty';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Card, CardContent, CardHeader, CardProps } from '@/components/base/ui/card';
import { getDbSnpUrl } from '@/components/feature/variant/utils';
import { useI18n } from '@/components/hooks/i18n';

function ExternalReferencesCard({ data, ...props }: { data: VariantOverview } & CardProps) {
  const { t } = useI18n();

  const isEmpty = !data?.clinvar_name && !data?.locus && !data?.rsnumber;

  return (
    <Card {...props}>
      <CardHeader className="flex flex-row justify-between pb-0">
        <div className="font-semibold">{t('variantEntity.overview.externalReferences')}</div>
      </CardHeader>
      <CardContent className="text-sm space-y-3 h-full">
        {isEmpty && (
          <Empty bordered showIcon={false} description={t('variant.noDataForVariant')} className="py-6 h-full" />
        )}
        {data?.clinvar_name && (
          <AnchorLink
            size="sm"
            href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${data?.clinvar_name}`}
            variant="secondary"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1"
            external
          >
            {t('variantEntity.overview.clinVar')}
          </AnchorLink>
        )}
        {data?.locus && (
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
        )}
        {data?.rsnumber && (
          <AnchorLink
            size="sm"
            href={getDbSnpUrl(data.rsnumber)}
            variant="secondary"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1"
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

import type { VariantOverview } from '@/api/api';
import Empty from '@/components/base/empties/empty';
import { Badge } from '@/components/base/shadcn/badge';
import { Card, CardContent, CardHeader, type CardProps } from '@/components/base/shadcn/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { getOmimEntryUrl } from '@/components/lib/external-links';

function AssociatedConditionsCard({ data, ...props }: { data: VariantOverview } & CardProps) {
  const { t } = useI18n();

  const isEmpty = !data?.omim_conditions?.length;

  return (
    <Card data-cy="associated-conditions-card" {...props}>
      <CardHeader className="flex flex-row justify-between pb-0">
        <div className="font-semibold">{t('variant_entity.overview.associated_conditions_omim')}</div>
      </CardHeader>
      <CardContent className="text-sm space-y-3 h-full">
        {isEmpty && (
          <Empty bordered showIcon={false} description={t('variant.no_data_for_variant')} className="py-6 h-full" />
        )}
        {data?.omim_conditions?.map(condition => (
          <div
            key={`${condition.panel}${condition.omim_phenotype_id}`}
            data-cy={condition.omim_phenotype_id}
            className="flex items-center justify-between"
          >
            <span>
              <a
                data-cy={`${condition.omim_phenotype_id}-link`}
                href={condition.omim_phenotype_id ? getOmimEntryUrl(condition.omim_phenotype_id) : undefined}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {condition.panel}
              </a>
            </span>
            <div className="flex items-center gap-1">
              {condition.inheritance_code?.map(code => (
                <Tooltip key={`${condition.panel}${condition.omim_phenotype_id}${code}`}>
                  <TooltipTrigger>
                    <Badge variant="outline">{code}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>{t(`variant.omim.${code}`)}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default AssociatedConditionsCard;

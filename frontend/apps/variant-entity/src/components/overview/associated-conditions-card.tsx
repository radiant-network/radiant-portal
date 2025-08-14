import { VariantOverview } from '@/api/api';
import Empty from '@/components/base/empty';
import { Badge } from '@/components/base/ui/badge';
import { Card, CardContent, CardHeader, CardProps } from '@/components/base/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';

function AssociatedConditionsCard({ data, ...props }: { data: VariantOverview } & CardProps) {
  const { t } = useI18n();

  const isEmpty = !data?.omim_conditions?.length;

  return (
    <Card {...props}>
      <CardHeader className="flex flex-row justify-between pb-0">
        <div className="font-semibold">{t('variant_entity.overview.associated_conditions_omim')}</div>
      </CardHeader>
      <CardContent className="text-sm space-y-6 h-full">
        {isEmpty && (
          <Empty bordered showIcon={false} description={t('variant.no_data_for_variant')} className="py-6 h-full" />
        )}
        {data?.omim_conditions?.map(condition => (
          <div key={`${condition.panel}${condition.omim_phenotype_id}`} className="flex items-center justify-between">
            <span>
              <a
                href={`https://www.omim.org/entry/${condition.omim_phenotype_id}`}
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

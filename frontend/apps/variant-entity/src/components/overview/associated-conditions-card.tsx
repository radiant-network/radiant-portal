import { Card, CardContent, CardHeader } from '@/components/base/ui/card';
import { VariantOverview } from '@/api/api';
import { Badge } from '@/components/base/ui/badge';
import { useI18n } from '@/components/hooks/i18n';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { ComponentProps } from 'react';

function AssociatedConditionsCard({ data, ...props }: { data: VariantOverview } & ComponentProps<'div'>) {
  const { t } = useI18n();

  return (
    <Card {...props}>
      <CardHeader className="flex flex-row justify-between pb-0">
        <div className="font-semibold">{t('variantEntity.overview.associatedConditionsOmim')}</div>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        {data?.omim_conditions?.map(condition => (
          <div key={`${condition.panel}${condition.omim_phenotype_id}`} className="flex items-center justify-between">
            <span className="text-muted-foreground">
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

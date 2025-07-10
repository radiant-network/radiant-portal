import { Card, CardContent, CardHeader } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { ComponentProps } from 'react';

function AnalysisCard({ data, ...props }: { data: any } & ComponentProps<'div'>) {
  const { t } = useI18n();

  return (
    <Card {...props}>
      <CardHeader className="flex flex-row justify-between pb-0">
        <div className="font-semibold">{t('variantEntity.overview.associatedConditionsOmim')}</div>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
          <div key="" className="flex items-center justify-between">
            <span className="text-muted-foreground">
              <a
                // href={`https://www.omim.org/entry/${data.case_analysis_code}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {data.case_analysis_name}
              </a>
            </span>
            <div className="flex items-center gap-1">
            </div>
          </div>
      </CardContent>
    </Card>
  );
}

export default AnalysisCard;

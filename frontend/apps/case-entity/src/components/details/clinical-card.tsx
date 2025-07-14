import { CaseEntity } from "@/api/api";
import { Button } from "@/components/base/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/base/ui/card";
import { useI18n } from "@/components/hooks/i18n";
import { ArrowUpRightIcon, AudioWaveformIcon } from "lucide-react";
import PhenotypeConditionLink, { PhenotypeType } from '@/components/base/navigation/phenotypes/phenotype-condition-link';
import { ComponentProps } from "react";

type ClinicalCardProps = ComponentProps<'div'> & {
  data: CaseEntity;
};
function ClinicalCard({ data, ...props }: ClinicalCardProps) {
  const { t } = useI18n();

  console.log('data', data);

  return (
    <Card {...props}>
      <CardHeader className="border-b [.border-b]:pb-2">
        <CardTitle size="xl">
          {t('caseEntity.details.clinicalOverview')}
        </CardTitle>
        <CardAction>
          <Button>
            <AudioWaveformIcon />
            {t('caseEntity.details.view_variants')}
            <ArrowUpRightIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <CardTitle>{t('caseEntity.details.primary_condition')}</CardTitle>
          <PhenotypeConditionLink type={PhenotypeType.HPO} code={data.primary_condition_id} name={data.primary_condition_name} />
        </div>
        {/* TODO: to be implemented after mvp */}
        {/* <div> */}
        {/*   {t('caseEntity.details.ethnicity')} */}
        {/* </div> */}
        {/* <div> */}
        {/*   <CardTitle >{t('caseEntity.details.phenotypes')}</CardTitle> */}
        {/* </div> */}
        {/* <div> */}
        {/*   <CardTitle>{t('caseEntity.details.phenotypes_observed')}</CardTitle> */}
        {/* </div> */}
        {/* <div> */}
        {/*   <CardTitle>{t('caseEntity.details.phenotypes_non_observed')}</CardTitle> */}
        {/* </div> */}
        <div>
          <CardTitle className="text-base">{t('caseEntity.details.clinical_note')}</CardTitle>
          <div>
            {data.note}
          </div>
        </div>
      </CardContent>

    </Card>
  );
};
export default ClinicalCard;

import { CaseEntity, Term } from '@/api/api';
import { useNavigate } from 'react-router';
import { Button } from '@/components/base/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { ArrowUpRightIcon, AudioWaveformIcon } from 'lucide-react';
import PhenotypeConditionLink from '@/components/base/navigation/phenotypes/phenotype-condition-link';
import { ComponentProps } from 'react';
import { cn } from '@/components/lib/utils';
import { getBadgeAffectedCodeColor } from '../utils';
import { Badge } from '@/components/base/ui/badge';
import { Separator } from '@/components/base/ui/separator';
import { CollapsibleList } from '@/components/base/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

const PHENOTYPES_MAX_RENDER = 6;

type ClinicalCardProps = ComponentProps<'div'> & {
  data: CaseEntity;
};
function ClinicalCard({ data, ...props }: ClinicalCardProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const proband = data.members[0];
  const family = data.members.filter(member => member.relationship_to_proband);
  const hasFamily = family.length > 0;
  const hasVariants = data.assays.some(assay => assay.has_variants);

  return (
    <Card {...props}>
      <CardHeader className="border-b [.border-b]:pb-4">
        <CardTitle size="xl">{t('caseEntity.details.clinicalOverview')}</CardTitle>
        <CardAction>
          {hasVariants ? (
            <Button onClick={() => navigate('#variants')}>
              <AudioWaveformIcon /> {t('caseEntity.details.view_variants')} <ArrowUpRightIcon />
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger>
                <Button disabled onClick={() => navigate('#variants')} >
                  <AudioWaveformIcon /> {t('caseEntity.details.view_variants')} <ArrowUpRightIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('caseEntity.details.no_variants')}</TooltipContent>
            </Tooltip>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="gap-6 grid grid-cols-1 md:grid-cols-6">
          {/* Proband */}
          <div className={cn('flex flex-col gap-6', { 'col-span-3': hasFamily, 'col-span-6': !hasFamily })}>
            {/* Primary Condition */}
            <div>
              <CardTitle>{t('caseEntity.details.primary_condition')}</CardTitle>
              <PhenotypeConditionLink code={data.primary_condition_id} name={data.primary_condition_name} />
            </div>

            {/* Phenotypes */}
            <div className="flex flex-col gap-2">
              <CardTitle>{t('caseEntity.details.phenotypes')}</CardTitle>

              {/* Phenotypes Observed */}
              <CardTitle size="xs" className="font-bold">
                {t('caseEntity.details.phenotypes_observed')}
              </CardTitle>


              <CollapsibleList
                list={proband.observed_phenotypes ?? []}
                render={({ id, name, onset_code }: Term) => (
                  <PhenotypeConditionLink code={id} name={name} onsetCode={onset_code} />
                )}
                limit={PHENOTYPES_MAX_RENDER}
              />

              {/* {(proband.observed_phenotypes ?? []).slice(0, PHENOTYPES_MAX_RENDER).map(({ id, name, onset_code }: Term) => ( */}
              {/*   <PhenotypeConditionLink code={id} name={name} onsetCode={onset_code} /> */}
              {/* ))} */}

              {!proband.observed_phenotypes && (
                <span className="text-xs text-muted-foreground">{t('caseEntity.details.no_phenotype')}</span>
              )}

              {/* Phenotypes Non-Observed */}
              <CardTitle size="xs" className="font-bold">
                {t('caseEntity.details.phenotypes_non_observed')}
              </CardTitle>

              <CollapsibleList
                list={proband.non_observed_phenotypes ?? []}
                render={({ id, name, onset_code }: Term) => (
                  <PhenotypeConditionLink code={id} name={name} onsetCode={onset_code} />
                )}
                limit={PHENOTYPES_MAX_RENDER}
              />

              {!proband.non_observed_phenotypes && (
                <span className="text-xs text-muted-foreground">{t('caseEntity.details.no_phenotype')}</span>
              )}
            </div>

            {/* Clinical Note */}
            <Card className="p-4 gap-4">
              <CardTitle className="text-base">{t('caseEntity.details.clinical_note')}</CardTitle>
              <p className="text-sm">{data.note}</p>
            </Card>
          </div>

          {/* Family member */}
          <div className={cn('flex flex-col gap-4', { 'col-span-3': family.length > 0 })}>
            <Separator className="my-6 md:hidden" />
            {family.map(member => (
              <Card className="p-4 gap-4 flex">
                {/* Relationship */}
                <CardTitle>{member.relationship_to_proband}</CardTitle>

                {/* Affected Status Code */}
                {member.affected_status_code && (
                  <div>
                    <Badge variant={getBadgeAffectedCodeColor(member.affected_status_code)}>
                      {t(`caseEntity.variants.filters.affected_status_code.${member.affected_status_code}`)}
                    </Badge>
                  </div>
                )}

                {/* Phenotypes Observed */}
                {(member.observed_phenotypes ?? []).map(({ id, name }: Term) => (
                  <div key={id}>
                    <PhenotypeConditionLink code={id} name={name} />
                  </div>
                ))}
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default ClinicalCard;

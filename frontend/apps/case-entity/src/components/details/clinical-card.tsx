import { CaseEntity, Term } from '@/api/api';
import { useNavigate } from 'react-router';
import ExpandableList from '@/components/base/list/expandable-list';
import { Button } from '@/components/base/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardSeparator, CardTitle } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { ArrowUpRightIcon, AudioWaveformIcon } from 'lucide-react';
import PhenotypeConditionLink from '@/components/base/navigation/phenotypes/phenotype-condition-link';
import { ComponentProps } from 'react';
import { cn } from '@/components/lib/utils';
import AffectedStatusBadge, { AffectedStatusProps } from '@/components/base/badges/affected-status-badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

const PHENOTYPES_VISIBLE_COUNT = 6;

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
            <Button onClick={() => navigate('?tab=variants')}>
              <AudioWaveformIcon /> {t('caseEntity.details.view_variants')} <ArrowUpRightIcon />
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger>
                <Button disabled>
                  <AudioWaveformIcon /> {t('caseEntity.details.view_variants')} <ArrowUpRightIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('caseEntity.details.no_variants')}</TooltipContent>
            </Tooltip>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 md:flex-row">
        {/* Proband */}
        <div className={cn('flex flex-col gap-3 flex-1')}>
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

            <ExpandableList
              items={proband.observed_phenotypes ?? []}
              renderItem={item => (
                <PhenotypeConditionLink code={item.id} name={item.name} onsetCode={item.onset_code} />
              )}
              visibleCount={PHENOTYPES_VISIBLE_COUNT}
            />

            {!proband.observed_phenotypes && (
              <span className="text-xs text-muted-foreground">{t('caseEntity.details.no_phenotype')}</span>
            )}

            {/* Phenotypes Non-Observed */}
            <CardTitle size="xs" className="font-bold">
              {t('caseEntity.details.phenotypes_non_observed')}
            </CardTitle>

            <ExpandableList
              items={proband.non_observed_phenotypes ?? []}
              renderItem={item => (
                <PhenotypeConditionLink code={item.id} name={item.name} onsetCode={item.onset_code} />
              )}
              visibleCount={PHENOTYPES_VISIBLE_COUNT}
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
        {hasFamily && (
          <>
            <CardSeparator />

            <div className={cn('flex flex-col gap-4 flex-1')}>
              {family.map(member => (
                <Card className="p-4 gap-4 flex">
                  {/* Relationship */}
                  <CardTitle className="capitalize">{member.relationship_to_proband}</CardTitle>

                  {/* Affected Status Code */}
                  {member.affected_status_code && (
                    <div>
                      <AffectedStatusBadge status={member.affected_status_code as AffectedStatusProps} />
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
export default ClinicalCard;

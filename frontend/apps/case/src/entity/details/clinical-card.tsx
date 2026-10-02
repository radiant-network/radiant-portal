import type { ComponentProps } from 'react';
import { useSearchParams } from 'react-router';
import { ArrowUpRightIcon, AudioWaveformIcon } from 'lucide-react';

import type { CaseEntity, CaseExam, CasePatientClinicalInformation, Term } from '@/api/api';
import AffectedStatusBadge, { type AffectedStatusProps } from '@/components/base/badges/affected-status-badge';
import { FETUS } from '@/components/base/constants';
import ExpandableList from '@/components/base/list/expandable-list';
import PhenotypeConditionLink from '@/components/base/navigation/phenotypes/phenotype-condition-link';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardAction, CardContent, CardHeader, CardSeparator, CardTitle } from '@/components/base/shadcn/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { CaseEntityTabs } from '@/components/cores/types/case-tabs';
import { useI18n } from '@/components/hooks/i18n';
import {
  getCaseSubjects,
  getFetusRank,
  getMemberKey,
  groupExams,
  isPrenatalMother,
} from '@/components/lib/case-entity';
import { cn } from '@/components/lib/utils';

const PHENOTYPES_VISIBLE_COUNT = 6;

function PhenotypeSection({ title, phenotypes }: { title: string; phenotypes?: Term[] }) {
  const { t } = useI18n();

  return (
    <>
      <CardTitle size="xs" className="font-bold">
        {title}
      </CardTitle>

      <ExpandableList
        items={(phenotypes ?? []).map(item => (
          <PhenotypeConditionLink key={item.id} code={item.id} name={item.name} onsetCode={item.onset_code} />
        ))}
        visibleCount={PHENOTYPES_VISIBLE_COUNT}
        emptyMessage={<span className="text-xs text-muted-foreground">{t('case_entity.details.no_phenotype')}</span>}
      />
    </>
  );
}

function NotesCard({ notes }: { notes?: string[] }) {
  const { t } = useI18n();

  if (!notes?.length) {
    return null;
  }

  return (
    <Card className="p-4 gap-4 shadow-none">
      <CardTitle className="text-base">{t('case_entity.details.clinical_note')}</CardTitle>
      <div className="flex flex-col gap-2">
        {notes.map((note, index) => (
          <p key={index} className="text-sm whitespace-pre-line">
            {note}
          </p>
        ))}
      </div>
    </Card>
  );
}

function ObservationsCard({ exams }: { exams?: CaseExam[] }) {
  const { t } = useI18n();
  const groupedExams = groupExams(exams);

  if (!groupedExams.length) {
    return null;
  }

  return (
    <Card className="p-4 gap-4 shadow-none">
      <CardTitle className="text-base">{t('case_entity.details.observations')}</CardTitle>

      <div className="flex flex-col gap-3">
        {groupedExams.map(exam => (
          <div key={exam.code} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{exam.name}</span>
              {exam.interpretationCode && (
                <Badge variant={exam.interpretationCode === 'abnormal' ? 'red' : 'secondary'}>
                  {t(`case_entity.details.exam_interpretation.${exam.interpretationCode}`)}
                </Badge>
              )}
            </div>

            {exam.values.map((value, index) => (
              <span key={index} className="text-xs text-muted-foreground whitespace-pre-line pl-3">
                {value}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

function MemberDetails({ member }: { member?: CasePatientClinicalInformation }) {
  const { t } = useI18n();

  if (!member) {
    return null;
  }

  const hasNonObservedPhenotypes = (member.non_observed_phenotypes?.length ?? 0) > 0;
  const hasPhenotypes = (member.observed_phenotypes?.length ?? 0) > 0 || hasNonObservedPhenotypes;

  return (
    <>
      <div className="flex flex-col gap-2">
        <CardTitle>{t('case_entity.details.phenotypes')}</CardTitle>

        {hasPhenotypes ? (
          <>
            <PhenotypeSection
              title={t('case_entity.details.phenotypes_observed')}
              phenotypes={member.observed_phenotypes}
            />

            {hasNonObservedPhenotypes && (
              <PhenotypeSection
                title={t('case_entity.details.phenotypes_non_observed')}
                phenotypes={member.non_observed_phenotypes}
              />
            )}
          </>
        ) : (
          <span className="text-xs text-muted-foreground">{t('case_entity.details.no_phenotype')}</span>
        )}
      </div>

      {member.consanguinity && (
        <div>
          <CardTitle>{t('case_entity.details.consanguinity')}</CardTitle>
          <p className="text-sm">{member.consanguinity.name || member.consanguinity.code}</p>
        </div>
      )}

      {!!member.ethnicities?.length && (
        <div>
          <CardTitle>{t('case_entity.details.ethnicity')}</CardTitle>
          <p className="text-sm">{member.ethnicities.map(ethnicity => ethnicity.name || ethnicity.code).join(', ')}</p>
        </div>
      )}

      {!!member.family_history?.length && (
        <div className="flex flex-col gap-2">
          <CardTitle>{t('case_entity.details.family_history')}</CardTitle>
          {member.family_history.map((entry, index) => (
            <div key={index} className="flex flex-col">
              <CardTitle size="xs" className="font-bold">
                {t(`common.relationships.${entry.family_member_code}`)}
              </CardTitle>
              <p className="text-sm whitespace-pre-line pl-3">{entry.condition}</p>
            </div>
          ))}
        </div>
      )}

      <NotesCard notes={member.notes} />
      <ObservationsCard exams={member.exams} />
    </>
  );
}

type ClinicalCardProps = ComponentProps<'div'> & {
  data: CaseEntity;
};
function ClinicalCard({ data, ...props }: ClinicalCardProps) {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const { subjects, relatives } = getCaseSubjects(data.members);
  const hasRelatives = relatives.length > 0;
  const hasVariants = data.sequencing_experiments.some(seqExp => seqExp.has_variants);

  return (
    <Card data-cy="clinical-card" {...props}>
      <CardHeader className="border-b [.border-b]:pb-4">
        <CardTitle size="xl">{t('case_entity.details.clinical_overview')}</CardTitle>
        <CardAction>
          {hasVariants ? (
            <Button
              onClick={() => {
                searchParams.set('tab', CaseEntityTabs.Variants);
                setSearchParams(searchParams, { replace: true });
              }}
            >
              <AudioWaveformIcon /> {t('case_entity.details.view_variants')} <ArrowUpRightIcon />
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button disabled>
                    <AudioWaveformIcon /> {t('case_entity.details.view_variants')} <ArrowUpRightIcon />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>{t('case_entity.details.no_variants')}</TooltipContent>
            </Tooltip>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 md:flex-row">
        {/* Proband */}
        <div className={cn('flex flex-col gap-6 flex-1')}>
          {/* Primary Condition */}
          <div>
            <CardTitle>{t('case_entity.details.primary_condition')}</CardTitle>
            <PhenotypeConditionLink code={data.primary_condition_id} name={data.primary_condition_name} />
          </div>

          {/* Diagnosis Hypothesis */}
          {data.diagnosis_hypothesis && (
            <div>
              <CardTitle>{t('case_entity.details.diagnosis_hypothesis')}</CardTitle>
              <p className="text-sm whitespace-pre-line">{data.diagnosis_hypothesis}</p>
            </div>
          )}

          {subjects.map(subject =>
            subject.relationship_to_proband === FETUS ? (
              <div key={getMemberKey(subject)} className="flex flex-col gap-4">
                <CardTitle>
                  {getFetusRank(subject, subjects)
                    ? t('case_entity.details.fetus_numbered', { index: getFetusRank(subject, subjects) })
                    : t('common.relationships.fetus')}
                </CardTitle>

                <MemberDetails member={subject} />
              </div>
            ) : (
              <MemberDetails key={getMemberKey(subject)} member={subject} />
            ),
          )}
        </div>

        {/* Family member */}
        {hasRelatives && (
          <>
            <CardSeparator />

            <div className={cn('flex flex-col gap-4 flex-1')}>
              {relatives.map(member => (
                <Card key={getMemberKey(member)} className="p-4 gap-4 flex shadow-none">
                  {/* Relationship — a prenatal case has no mother member: the proband IS the mother. */}
                  <CardTitle>
                    {isPrenatalMother(member, data.members)
                      ? t('common.relationships.mother')
                      : t(`common.relationships.${member.relationship_to_proband}`)}
                  </CardTitle>

                  {/* Affected Status Code */}
                  {member.affected_status_code && (
                    <div>
                      <AffectedStatusBadge status={member.affected_status_code as AffectedStatusProps} />
                    </div>
                  )}

                  <MemberDetails member={member} />
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

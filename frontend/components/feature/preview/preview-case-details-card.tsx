import { CaseEntity, CasePatientClinicalInformation } from '@/api/api';
import AffectedStatusBadge, { AffectedStatusProps } from '@/components/base/badges/affected-status-badge';
import ExpandableList from '@/components/base/list/expandable-list';
import PhenotypeConditionLink from '@/components/base/navigation/phenotypes/phenotype-condition-link';
import { Badge } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { PROBAND } from '@/components/feature/constants';
import { useI18n } from '@/components/hooks/i18n';
import { ArrowUpRight, FolderOpen } from 'lucide-react';
import PreviewCard from './preview-card';

const PHENOTYPES_VISIBLE_COUNT = 6;

const PreviewCaseDetailsCard = ({ caseEntity }: { caseEntity: CaseEntity }) => {
  const { t } = useI18n();

  return (
    <PreviewCard
      icon={FolderOpen}
      title={t('preview_sheet.case.title', { id: caseEntity.case_id })}
      actions={
        <Button variant="outline" size="sm" asChild>
          <a href={`/case/entity/${caseEntity.case_id}`} target="_blank">
            {t('preview_sheet.case.actions.open_case')}
            <ArrowUpRight />
          </a>
        </Button>
      }
    >
      <div className="flex flex-col gap-3 text-sm [&_h4]:text-sm">
        {caseEntity.members.map(member => (
          <FamilyMemberCard key={member.patient_id} member={member} />
        ))}
      </div>
    </PreviewCard>
  );
};

function FamilyMemberCard({ member }: { member: CasePatientClinicalInformation }) {
  const { t } = useI18n();
  const isProband = member.relationship_to_proband === PROBAND;

  return (
    <div className="rounded-md border border-border">
      <div className="flex flex-col gap-4 p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{t(`common.relationships.${member.relationship_to_proband}`)}</h3>
          {member.affected_status_code && (
            <AffectedStatusBadge status={member.affected_status_code as AffectedStatusProps} />
          )}
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground">Sex</span>
            <span className="text-muted-foreground">DOB</span>
            <span className="text-muted-foreground">Ethnicity</span>
          </div>
          <div className="flex flex-col gap-2 grow">
            <Badge variant="secondary" className="self-start">
              {t(`common.sex.${member.sex_code}`)}
            </Badge>
            <span className="font-mono">26/12/2018</span>
            <span>{member.ethnicity_codes ? member.ethnicity_codes.join('/') : '-'}</span>
          </div>
        </div>
        {isProband && (
          <div className="space-y-1">
            <h4 className="font-semibold">Primary Condition</h4>
            <p className="text-muted-foreground text-xs">No primary condition reported</p>
          </div>
        )}
        <div className="space-y-1">
          <h4 className="font-semibold">Phenotypes (HPO)</h4>
          {member.observed_phenotypes ? (
            <ExpandableList
              className="space-y-1"
              items={member.observed_phenotypes ?? []}
              renderItem={item => (
                <PhenotypeConditionLink code={item.id} name={item.name} onsetCode={item.onset_code} showCode={false} />
              )}
              visibleCount={PHENOTYPES_VISIBLE_COUNT}
            />
          ) : (
            <p className="text-muted-foreground text-xs">No phenotype reported</p>
          )}
        </div>
        {isProband && (
          <div className="space-y-1">
            <h4 className="font-semibold">Non-observed Phenotypes (HPO)</h4>
            {member.non_observed_phenotypes ? (
              <ExpandableList
                items={member.non_observed_phenotypes ?? []}
                className="space-y-1"
                renderItem={item => (
                  <PhenotypeConditionLink
                    code={item.id}
                    name={item.name}
                    onsetCode={item.onset_code}
                    showCode={false}
                  />
                )}
                visibleCount={PHENOTYPES_VISIBLE_COUNT}
              />
            ) : (
              <p className="text-muted-foreground text-xs">No non-observed phenotype reported</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviewCaseDetailsCard;

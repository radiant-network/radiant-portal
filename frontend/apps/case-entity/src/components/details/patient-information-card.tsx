import { ComponentProps, useCallback, useEffect, useState } from 'react';
import { formatDate } from 'date-fns';

import { CaseEntity, CasePatientClinicalInformation } from '@/api/api';
import { CopyButton } from '@/components/base/buttons/copy-button';
import InformationField from '@/components/base/information/information-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/base/ui/tabs';
import { useI18n } from '@/components/hooks/i18n';
import { titleCase } from '@/components/lib/string-format';

enum CaseType {
  germline_solo = 'germline_solo',
  germline_family = 'germline_family',
}

interface PatientInfoDisplayProps {
  member: CasePatientClinicalInformation | undefined;
}

function PatientInfoDisplay({ member }: PatientInfoDisplayProps) {
  const { t } = useI18n();

  if (!member) {
    return <div className="text-muted-foreground text-sm">No patient information available</div>;
  }

  return (
    <div className="flex w-full justify-between gap-4">
      <div className="flex flex-col gap-2 flex-1">
        <InformationField label={t('case_entity.patient_information.id')}>{member.patient_id}</InformationField>

        <InformationField
          label={t('case_entity.patient_information.dob')}
          labelTooltipText={t('case_entity.details.date_format_tooltip')}
        >
          {member.date_of_birth && formatDate(member.date_of_birth, t('common.date'))}
        </InformationField>

        <InformationField label={t('case_entity.patient_information.sex')}>
          {titleCase(member.sex_code)}
        </InformationField>

        <InformationField label={t('case_entity.patient_information.mrn')}>
          {member.mrn && <CopyButton value={member.mrn} label={member.mrn} className="-m-2" />}
        </InformationField>

        <InformationField
          label={t('case_entity.patient_information.managing_org')}
          labelTooltipText={t('case_entity.patient_information.managing_org_tooltip')}
          tooltipText={member.managing_organization_name}
        >
          {member.managing_organization_code}
        </InformationField>
      </div>
    </div>
  );
}

function PatientInformationCard({ data, ...props }: { data: CaseEntity } & ComponentProps<'div'>) {
  const { t } = useI18n();

  const isFamilyCase = data.case_type === CaseType.germline_family;
  const members = data.members || [];
  const [activeTab, setActiveTab] = useState<string>(() => members[0]?.patient_id.toString() || '');

  useEffect(() => {
    if (members.length > 0 && !members.find(m => m.patient_id.toString() === activeTab)) {
      setActiveTab(members[0].patient_id.toString());
    }
  }, [members, activeTab]);

  const getRelationshipLabel = useCallback(
    (relationship: string) =>
      t(
        `case_entity.patientInformation.relationships.${relationship}`,
        relationship.charAt(0).toUpperCase() + relationship.slice(1),
      ),
    [t],
  );

  if (isFamilyCase && members.length > 1) {
    return (
      <Card {...props}>
        <CardHeader className="border-b [.border-b]:pb-2">
          <CardTitle size="xl">{t('case_entity.patient_information.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              {members.map(member => (
                <TabsTrigger key={member.patient_id} value={member.patient_id.toString()}>
                  {getRelationshipLabel(member.relationship_to_proband || 'proband')}
                </TabsTrigger>
              ))}
            </TabsList>
            {members.map(member => (
              <TabsContent key={member.patient_id} value={member.patient_id.toString()}>
                <PatientInfoDisplay member={member} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  // Solo case or family case with only one member - show the first member only
  const firstMember = members[0];
  return (
    <Card {...props}>
      <CardHeader className="border-b [.border-b]:pb-2">
        <CardTitle size="xl">{t('case_entity.patient_information.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PatientInfoDisplay member={firstMember} />
      </CardContent>
    </Card>
  );
}

export default PatientInformationCard;

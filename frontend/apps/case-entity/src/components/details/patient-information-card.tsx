import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { ComponentProps, useState, useEffect, useCallback } from 'react';
import { CaseEntity, CasePatientClinicalInformation } from '@/api/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/base/ui/tabs';
import { formatDate } from 'date-fns';
import { CopyButton } from '@/components/base/buttons/copy-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

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
    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
      <div className="text-muted-foreground">{t('caseEntity.patientInformation.id')}</div>
      <div className="font-medium">{member.patient_id || '--'}</div>

      {/* TODO: to be implemented after mvp */}
      {/* 
      <div className="text-muted-foreground">{t('caseEntity.patientInformation.name')}</div>
      <div className="font-medium text-muted-foreground">--</div>
      */}
      
      <div className="text-muted-foreground">{t('caseEntity.patientInformation.dob')}</div>
      <div>{member.date_of_birth ? formatDate(member.date_of_birth, t('common.date')) : '--'}</div>

      <div className="text-muted-foreground">{t('caseEntity.patientInformation.sex')}</div>
      <div className="capitalize">{member.sex_code || '--'}</div>

      {/* TODO: to be implemented after mvp */}
      {/* 
      <div className="text-muted-foreground">{t('caseEntity.patientInformation.jhn')}</div>
      <div className="text-muted-foreground">--</div> 
      */}

      <div className="text-muted-foreground">{t('caseEntity.patientInformation.mrn')}</div>
      <div className="flex items-center">
        {member.mrn && (
          <CopyButton value={member.mrn} label={member.mrn || '--'} className="-m-2" />
        )}
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-muted-foreground underline decoration-dotted underline-offset-4 cursor-help">
            {t('caseEntity.patientInformation.managingOrg')}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {t('caseEntity.patientInformation.managingOrg_tooltips')}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
        <div>{member.managing_organization_code || '--'}</div>
        </TooltipTrigger>
        <TooltipContent>
          {member.managing_organization_name || '--'}
        </TooltipContent>
      </Tooltip>
      
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

  const getRelationshipLabel = useCallback((relationship: string) => {
    return t(`caseEntity.patientInformation.relationships.${relationship}`, relationship.charAt(0).toUpperCase() + relationship.slice(1));
  }, [t]);

  if (isFamilyCase && members.length > 1) {
    return (
      <Card {...props} className="h-auto size-max w-full">
        <CardHeader className="border-b [.border-b]:pb-2">
          <CardTitle size="xl">
            {t('caseEntity.patientInformation.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              {members.map((member) => (
                <TabsTrigger key={member.patient_id} value={member.patient_id.toString()}>
                  {getRelationshipLabel(member.relationship_to_proband || 'proband')}
                </TabsTrigger>
              ))}
            </TabsList>
            {members.map((member) => (
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
        <CardTitle size="xl">
          {t('caseEntity.patientInformation.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PatientInfoDisplay member={firstMember} />
      </CardContent>
    </Card>
  );
}

export default PatientInformationCard;

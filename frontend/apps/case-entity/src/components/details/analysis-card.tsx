import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import { User } from 'lucide-react';
import { ComponentProps, useState } from 'react';
import { formatDate } from 'date-fns';
import filterItemStatus from '@/case-exploration/components/table-filters/filter-item-status';
import filterItemPriority from '@/case-exploration/components/table-filters/filter-item-priority';
import { IFilterButtonItem } from '@/components/base/buttons/filter-button';
import { CaseEntity, CaseTask, Aggregation } from '@/api/api';
import InformationField from '@/components/base/information/information-field';
import BioinformaticsSection from './bioinformatics-section';

function AnalysisCard({ data, ...props }: { data: CaseEntity } & ComponentProps<'div'>) {
  const { t } = useI18n();

  // Mock data based on screenshot
  const caseData = data;

  // Dropdown options
  const priorityOptionsValues: Aggregation[] = [
    { key: 'routine', label: 'Routine' },
    { key: 'urgent', label: 'Urgent' },
    { key: 'stat', label: 'Stat' },
    { key: 'asap', label: 'ASAP' },
  ];

  const priorityOptions = filterItemPriority(priorityOptionsValues, t);

  const statusOptionsValues = [
    { "key": "incomplete", "label": "Incomplete" },
    { "key": "draft", "label": "Draft" },
    { "key": "revoke", "label": "Revoke" },
    { "key": "active", "label": "Active" },
    { "key": "completed", "label": "Completed" },
    { "key": "on-hold", "label": "On-hold" },
    { "key": "unknown", "label": "Unknown" }
  ];
  interface IStatusOption extends IFilterButtonItem {
    key: string;
    label: string;
  }

  const statusOptions: IStatusOption[] = filterItemStatus(statusOptionsValues, t) as IStatusOption[];

  const assigneeOptions = [
    { value: 'Vincent Ferretti', label: 'Vincent Ferretti' },
  ];
  // State for dropdown values
  const [priority, setPriority] = useState(caseData.priority_code || priorityOptions[0]?.key || 'routine');
  const [status, setStatus] = useState(caseData.status_code || statusOptions[0].key);
  const [assignedTo, setAssignedTo] = useState(assigneeOptions[0].value);


  const selectedPriority = priorityOptions.find(option => option.key === priority);
  const selectedStatus: IStatusOption | undefined = statusOptions.find(option => option.key === status);

  return (
    <Card {...props}>
      <CardHeader className="border-b [.border-b]:pb-2">
        <CardTitle size="xl">
          {t('caseEntity.details.analysisOverview')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Title with codes */}
        <div className="text-base font-semibold">
          {`${caseData.case_analysis_code} - ${caseData.case_analysis_name}`}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Static information */}
          <div className="flex w-full justify-between gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <InformationField
                label={t('caseEntity.details.createdOn')}
                tooltipsText={t('caseEntity.details.date_format_tooltips')}
              >
                {caseData.created_on && formatDate(caseData.created_on, t('common.date'))}
              </InformationField>

              <InformationField
                label={t('caseEntity.details.lastUpdate')}
                tooltipsText={t('caseEntity.details.date_format_tooltips')}
              >
                {caseData.updated_on && formatDate(caseData.updated_on, t('common.date'))}
              </InformationField>

              <InformationField
                label={t('caseEntity.details.prescriber')}
              >
                {caseData.prescriber}
              </InformationField>

              <InformationField
                label={t('caseEntity.details.prescribingInst')}
                labelTooltipsText={t('caseEntity.details.prescribingInst_tooltips')}
                tooltipsText={caseData.requested_by_name}
              >
                {caseData.requested_by_code}
              </InformationField>

              <InformationField
                label={t('caseEntity.details.diagLab')}
                tooltipsText={caseData.performer_lab_name}
                labelTooltipsText={t('caseEntity.details.diagLab_tooltips')}
              >
                {caseData.performer_lab_code}
              </InformationField>

              <InformationField
                label={t('caseEntity.details.requestId')}
              >
                {caseData.request_id}
              </InformationField>
            </div>
          </div>

          {/* Right side - Status information with dropdowns */}
          <div>
            <div className="grid md:grid-cols-[1fr_minmax(160px,180px)] grid-cols-2 gap-y-3 gap-x-2 text-sm items-center">
              <div className="flex text-muted-foreground md:justify-end justify-start">{t('caseEntity.details.priority')}</div>
              <div>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="min-w-[160px] max-w-[180px] h-7">
                    <SelectValue>
                      <div className="text-xs font-medium">
                        {selectedPriority?.label}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key || ''}>
                        <div className="text-xs font-medium">
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex text-muted-foreground md:justify-end justify-start">{t('caseEntity.details.status')}</div>
              <div>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="min-w-[160px] max-w-[180px] h-7 bg-blue-100 text-blue-700">
                    <SelectValue>
                      <div className="flex items-center gap-2 text-xs font-medium">
                        {selectedStatus && selectedStatus.icon && <selectedStatus.icon className="w-4 h-4 text-blue-700" />}
                        <span>{selectedStatus?.label}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        <div className="flex items-center gap-2 text-xs font-medium">
                          {option.icon && <option.icon className="w-4 h-4" />}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex text-muted-foreground md:justify-end justify-start">{t('caseEntity.details.assignedTo')}</div>
              <div>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger className="min-w-[160px] max-w-[180px] h-7">
                    <SelectValue>
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{assignedTo}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {assigneeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2 text-xs font-medium">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Bioinformatics section */}
        <BioinformaticsSection tasks={data.tasks} />
      </CardContent>
    </Card>
  );
}

export default AnalysisCard;

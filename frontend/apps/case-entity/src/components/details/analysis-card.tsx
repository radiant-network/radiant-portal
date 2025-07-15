import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { User } from 'lucide-react';
import { ComponentProps, useState } from 'react';
import { Badge } from '@/components/base/ui/badge';
import { formatDate } from 'date-fns';
import filterItemStatus from '@/case-exploration/components/table-filters/filter-item-status';
import { IFilterButtonItem } from '@/components/base/buttons/filter-button';

function AnalysisCard({ data, ...props }: { data: any } & ComponentProps<'div'>) {
  const { t } = useI18n();

  // Mock data based on screenshot
  const caseData = data;

  // Dropdown options
  const priorityOptions = [
    { value: 'routine', label: t('caseExploration.priority.routine'), color: 'bg-green-500' },
    { value: 'urgent', label: t('caseExploration.priority.urgent'), color: 'bg-yellow-500' },
    { value: 'asap', label: t('caseExploration.priority.asap'), color: 'bg-orange-500' },
    { value: 'stat', label: t('caseExploration.priority.stat'), color: 'bg-red-500' },
  ];
  
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

  const statusOptions: IStatusOption[] = filterItemStatus(statusOptionsValues, t);

  const assigneeOptions = [
    { value: 'Vincent Ferretti', label: 'Vincent Ferretti' },
  ];
  // State for dropdown values
  const [priority, setPriority] = useState(caseData.priority_code || priorityOptions[0].value);
  const [status, setStatus] = useState(caseData.status_code || statusOptions[0].key);
  const [assignedTo, setAssignedTo] = useState(caseData.assigned_to || assigneeOptions[0].value);


  const selectedPriority = priorityOptions.find(option => option.value === priority);
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
        <div className="text-base font-medium">
          {`${caseData.case_analysis_code} - ${caseData.case_analysis_name}`}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Static information */}
          <div className="gap-4">
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <div className="text-muted-foreground">{t('caseEntity.details.createdOn')}</div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">{caseData.created_on ? formatDate(caseData.created_on, t('common.date')) : '--'}</div>
                </TooltipTrigger>
                <TooltipContent>
                  {t('caseEntity.details.createdOn_tooltips')}
                </TooltipContent>
              </Tooltip>

              <div className="text-muted-foreground">{t('caseEntity.details.lastUpdate')}</div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">{caseData.updated_on ? formatDate(caseData.updated_on, t('common.date')) : '--'}</div>
                </TooltipTrigger>
                <TooltipContent>
                  {t('caseEntity.details.lastUpdate_tooltips')}
                </TooltipContent>
              </Tooltip>

              <div className="text-muted-foreground">{t('caseEntity.details.prescriber')}</div>
              <div>{caseData.prescriber || '--'}</div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-muted-foreground underline decoration-dotted underline-offset-4 cursor-help">
                    {t('caseEntity.details.prescribingInst')}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {t('caseEntity.details.prescribingInst_tooltips')}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    {caseData.managing_organization_code || '--'}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {caseData.managing_organization_name || '--'}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-muted-foreground underline decoration-dotted underline-offset-4 cursor-help">{t('caseEntity.details.diagLab')}</div>
                </TooltipTrigger>
                <TooltipContent>
                  {t('caseEntity.details.diagLab_tooltips')}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    {caseData.performer_lab_code || '--'}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {caseData.performer_lab_name || '--'}
                </TooltipContent>
              </Tooltip>


              <div className="text-muted-foreground">{t('caseEntity.details.requestId')}</div>
              <div>{caseData.request_id || '--'}</div>
            </div>
          </div>

          {/* Right side - Status information with dropdowns */}
          <div className="gap-2">
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm items-center">
              <div className="flex text-muted-foreground justify-end">{t('caseEntity.details.priority')}</div>
              <div>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="w-full h-7">
                    <SelectValue>
                      <div className="flex items-center gap-2 text-xs">
                        {selectedPriority && <div className={`w-2 h-2 ${selectedPriority.color} rounded-full`}></div>}
                        <span>{priority}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`w-2 h-2 ${option.color} rounded-full`}></div>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex text-muted-foreground justify-end">{t('caseEntity.details.status')}</div>
              <div>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full h-7 bg-blue-100 text-blue-700">
                    <SelectValue>
                      <div className="flex items-center gap-2 text-xs">
                        {selectedStatus && selectedStatus.icon && <selectedStatus.icon className="w-4 h-4 text-blue-500" />}
                        <span>{selectedStatus?.label}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        <div className="flex items-center gap-2 text-xs">
                          {option.icon && <option.icon className="w-4 h-4 text-blue-700" />}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex text-muted-foreground justify-end">{t('caseEntity.details.assignedTo')}</div>
              <div>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger className="w-full h-7">
                    <SelectValue>
                      <div className="flex items-center gap-2 text-xs">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{assignedTo}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {assigneeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2 text-xs">
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
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{t('caseEntity.details.bioinformatics')}</span>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-3">
              <div className="p-3 text-sm font-medium text-muted-foreground">{t('caseEntity.details.taskId')}</div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-3 text-sm font-medium text-muted-foreground text-muted-foreground underline decoration-dotted underline-offset-4 cursor-help">
                    {t('caseEntity.details.type')}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {t('caseEntity.details.createdOn_tooltips')}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-end p-3 text-sm font-medium text-muted-foreground text-muted-foreground underline decoration-dotted underline-offset-4 cursor-help">
                    {t('caseEntity.details.createdOn')}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {t('caseEntity.details.createdOn_tooltips')}
                </TooltipContent>
              </Tooltip>
            </div>
            {caseData.tasks.length > 0 ? caseData.tasks.map((bioInfo: any, index: number) => (
              <div key={index} className="grid grid-cols-3 border-b last:border-b-0">
                <div className="p-3 text-sm">
                  {bioInfo.task_id}
                </div>
                <div className="p-3 text-sm"><Badge variant="secondary" className="text-xs">{bioInfo.type}</Badge></div>
                <div className="text-end p-3 text-sm">{bioInfo.created_on}</div>
              </div>
            )) : <div className="p-3 text-sm">{t('caseEntity.details.noTaskFound')}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AnalysisCard;

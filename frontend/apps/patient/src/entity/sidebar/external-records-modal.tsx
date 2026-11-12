import type { PatientDocumentClass, PatientExchangeOrganization } from '@/api/api';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/shadcn/accordion';
import { Badge } from '@/components/base/shadcn/badge';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/base/shadcn/dialog';
import { useI18n } from '@/components/hooks/i18n';

type ExternalRecordsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizations: PatientExchangeOrganization[];
  organizationCount: number;
  documentCount: number;
};

function ExternalRecordsModal({
  open,
  onOpenChange,
  organizations,
  organizationCount,
  documentCount,
}: ExternalRecordsModalProps) {
  const { t } = useI18n();
  const visibleOrganizations = organizations.filter(org => org.document_count > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="stickyHeader" size="md">
        <DialogHeader>
          <div className="flex w-full items-center gap-3">
            <DialogTitle>{t('patient_entity.sidebar.external_records.title')}</DialogTitle>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {t('patient_entity.sidebar.external_records.networks')}
            </Badge>
            <span className="ml-auto text-xs text-muted-foreground tabular-nums whitespace-nowrap">
              {t('patient_entity.sidebar.external_records.header_summary', {
                orgs: organizationCount,
                docs: documentCount.toLocaleString(),
              })}
            </span>
          </div>
        </DialogHeader>
        <DialogBody className="overflow-y-auto">
          <Accordion type="multiple" defaultValue={visibleOrganizations[0] ? [orgKey(0)] : []}>
            {visibleOrganizations.map((org, i) => (
              <OrganizationItem key={orgKey(i)} value={orgKey(i)} org={org} />
            ))}
          </Accordion>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

const orgKey = (i: number) => `org-${i}`;

type OrganizationItemProps = {
  value: string;
  org: PatientExchangeOrganization;
};

function OrganizationItem({ value, org }: OrganizationItemProps) {
  const { t } = useI18n();
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>
        <div className="flex flex-1 items-center gap-2">
          <span className="text-sm font-semibold">{org.name}</span>
          {org.network && (
            <Badge variant="secondary">{t(`patient_entity.sidebar.external_records.network.${org.network}`)}</Badge>
          )}
          <span className="ml-auto text-sm font-semibold tabular-nums">{org.document_count.toLocaleString()}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-6">
        <Accordion type="multiple">
          {org.document_classes.map((cls, i) =>
            cls.types.length > 0 ? (
              <DocumentAccordionItem key={`${value}-cls-${i}`} value={`${value}-cls-${i}`} cls={cls} />
            ) : (
              <CountItem key={`${value}-cls-${i}`} name={cls.name} count={cls.document_count} />
            ),
          )}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
}

type DocumentAccordionItemProps = {
  value: string;
  cls: PatientDocumentClass;
};

function DocumentAccordionItem({ value, cls }: DocumentAccordionItemProps) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>
        <div className="flex flex-1 items-center gap-2">
          <span className="text-sm">{cls.name}</span>
          <span className="ml-auto text-sm font-medium tabular-nums">{cls.document_count.toLocaleString()}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-6">
        <ul className="flex flex-col">
          {cls.types.map((type, i) => (
            <li
              key={`${value}-type-${i}`}
              className="flex items-center justify-between gap-2 py-1 text-xs text-muted-foreground"
            >
              <span>{type.name}</span>
              <span className="tabular-nums">{type.document_count.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}

type CountItemProps = {
  name: string;
  count: number;
};

function CountItem({ name, count }: CountItemProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-b py-2 pl-6">
      <span className="text-sm">{name}</span>
      <span className="text-sm font-medium tabular-nums">{count.toLocaleString()}</span>
    </div>
  );
}

export default ExternalRecordsModal;

import { useState } from 'react';
import { useRouteLoaderData } from 'react-router';
import { toast } from 'sonner';
import useSWR from 'swr';

import type { CaseAssignee } from '@/api/api';
import type { AssignmentPickerProps } from '@/components/base/assignation/assignment-picker';
import AssignmentPicker from '@/components/base/assignation/assignment-picker';
import type { AvatarButtonVariant, AvatarUser } from '@/components/base/avatar/avatar.types';
import type { AvatarSize } from '@/components/base/shadcn/avatar';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { caseApi } from '@/utils/api';

import { useCanEditCase } from '../permissions/use-case-permissions';

// Portal layout route whose loader returns the session user.
const PROTECTED_LAYOUT_ROUTE_ID = 'layout/protected-layout';

type CandidatesInput = {
  key: string;
  caseId: number;
};

function toAvatarUser(assignee: CaseAssignee): AvatarUser {
  const name = [assignee.first_name, assignee.last_name].filter(Boolean).join(' ');
  return { id: assignee.user_id, name: name || assignee.email || assignee.user_id, email: assignee.email };
}

async function fetchCandidates(input: CandidatesInput, tenant: string) {
  const response = await caseApi.listCaseAssignmentCandidates(tenant, input.caseId);
  return response.data.map(toAvatarUser);
}

type CaseAssignmentProps = {
  caseId: number;
  diagnosisLabCode?: string;
  assignees: CaseAssignee[];
  size?: AvatarSize;
  buttonVariant?: AvatarButtonVariant;
  align?: AssignmentPickerProps['align'];
  onSaved?: () => void;
};

function CaseAssignment({
  caseId,
  diagnosisLabCode,
  assignees,
  size,
  buttonVariant,
  align,
  onSaved,
}: CaseAssignmentProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const canEdit = useCanEditCase(diagnosisLabCode);
  const sessionUser = useRouteLoaderData<{ sub: string }>(PROTECTED_LAYOUT_ROUTE_ID);
  const [hasOpened, setHasOpened] = useState(false);

  // Fetched on first opening only: the endpoint requires can_edit_case.
  const { data: candidates = [], isLoading } = useSWR<AvatarUser[], unknown, CandidatesInput | null>(
    canEdit && hasOpened ? { key: 'case-assignment-candidates', caseId } : null,
    input => fetchCandidates(input, tenant),
    { revalidateOnFocus: false },
  );

  async function handleApply(users: AvatarUser[]) {
    try {
      await caseApi.putCaseAssignments(tenant, caseId, { user_ids: users.map(user => user.id) });
      onSaved?.();
    } catch {
      toast.error(t('case_assignment.error'));
    }
  }

  return (
    <AssignmentPicker
      candidates={candidates}
      assignees={assignees.map(toAvatarUser)}
      canEdit={canEdit}
      size={size}
      buttonVariant={buttonVariant}
      align={align}
      currentUserId={sessionUser?.sub}
      isLoading={isLoading}
      onApply={handleApply}
      onOpenChange={open => open && setHasOpened(true)}
    />
  );
}

export default CaseAssignment;

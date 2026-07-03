import { UserAvatar } from '@/components/base/avatar';
import { Card } from '@/components/base/shadcn/card';

import type { CommunityMember } from './mocks/community-model';
import HighlightText from './highlight-text';

type CommunityMemberCardProps = {
  member: CommunityMember;
  /** Current search term, highlighted where it matches the name or affiliation. */
  highlight?: string;
};

export default function CommunityMemberCard({ member, highlight }: CommunityMemberCardProps) {
  const name = `${member.firstName} ${member.lastName}`;

  return (
    <Card size="sm" className="flex flex-col items-center gap-2 p-6 text-center">
      <UserAvatar user={{ id: member.id, name }} size="2xl" />
      <span className="text-primary font-semibold">
        <HighlightText text={name} query={highlight} />
      </span>
      {member.affiliation && (
        <span className="text-muted-foreground text-sm">
          <HighlightText text={member.affiliation} query={highlight} />
        </span>
      )}
    </Card>
  );
}

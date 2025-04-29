import BackLink from '@/components/base/navigation/back-link';
import TabsNav, { TabsNavItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import { Badge } from '@/components/base/ui/badge';
import { Link } from 'react-router';

function EntityHeader() {
  return (
    <div className="flex flex-col gap-4 bg-background pt-6 px-6">
      <Link to="/">
        <BackLink>Variants</BackLink>
      </Link>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">chr7:1212342453234</h1>
        <Badge>Germline</Badge>
      </div>
      <TabsNav value="overview">
        <TabsNavItem value="overview">Overview</TabsNavItem>
        <TabsNavItem value="evidence">Evidence</TabsNavItem>
        <TabsNavItem value="frequency">Frequency</TabsNavItem>
        <TabsNavItem value="conditions">Conditions</TabsNavItem>
        <TabsNavItem value="transcripts">Transcripts</TabsNavItem>
        <TabsNavItem value="cases">Cases</TabsNavItem>
      </TabsNav>
    </div>
  );
}

export default EntityHeader;

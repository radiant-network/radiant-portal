import { cn } from '@/components/lib/utils';
import { tabContentClassName } from '@/style';

import MyNetworkCard from './my-network-card';
import PublicCochortsCard from './public-cohorts-card';

function FrequencyTab() {
  return (
    <div className={cn('flex flex-col', tabContentClassName)}>
      <MyNetworkCard />
      <PublicCochortsCard />
    </div>
  );
}

export default FrequencyTab;

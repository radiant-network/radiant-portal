import { useRouteLoaderData } from 'react-router';

import { useTenant } from './use-tenant';

type RootFeatures = {
  caseVariantsReportTenants: string[];
};

const ROOT_ROUTE_ID = 'root';

function useFeatureFlags() {
  const { tenant } = useTenant();
  const features = useRouteLoaderData<{ features?: RootFeatures }>(ROOT_ROUTE_ID)?.features;

  return {
    caseVariantsReport: features?.caseVariantsReportTenants.includes(tenant) ?? false,
  };
}

export default useFeatureFlags;

import { useRouteLoaderData } from 'react-router';

type RuntimeConfig = {
  librechatDavidUrl: string;
};

const ROOT_ROUTE_ID = 'root';
const DEFAULT_CONFIG: RuntimeConfig = { librechatDavidUrl: '' };

export function useRuntimeConfig(): RuntimeConfig {
  const data = useRouteLoaderData<{ runtimeConfig?: RuntimeConfig }>(ROOT_ROUTE_ID);
  return data?.runtimeConfig ?? DEFAULT_CONFIG;
}

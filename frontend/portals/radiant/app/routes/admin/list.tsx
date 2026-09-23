import { Navigate } from 'react-router';
import AdminExploration from 'admin/exploration/admin-exploration';

import { useCanAdministerTenant, useTenantPath } from '@/components/hooks/use-tenant';

const AdminExplorationRoute = () => {
  const canAdministerTenant = useCanAdministerTenant();
  const tenantPath = useTenantPath();

  return canAdministerTenant ? <AdminExploration /> : <Navigate to={tenantPath('/case')} replace />;
};

export default AdminExplorationRoute;

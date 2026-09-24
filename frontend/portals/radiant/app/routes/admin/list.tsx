import { Navigate } from 'react-router';
import AdminExploration from 'admin/exploration/admin-exploration';

import { useCanAdministerTenant, useLocalPath } from '@/components/hooks/use-tenant';

const AdminExplorationRoute = () => {
  const canAdministerTenant = useCanAdministerTenant();
  const localPath = useLocalPath();

  return canAdministerTenant ? <AdminExploration /> : <Navigate to={localPath('/case')} replace />;
};

export default AdminExplorationRoute;

import { Navigate } from 'react-router';
import AdminExploration from 'admin/exploration/admin-exploration';

import { useCanAdministerTenant } from '@/components/hooks/use-tenant';

const AdminExplorationRoute = () => {
  const canAdministerTenant = useCanAdministerTenant();

  return canAdministerTenant ? <AdminExploration /> : <Navigate to="/case" replace />;
};

export default AdminExplorationRoute;

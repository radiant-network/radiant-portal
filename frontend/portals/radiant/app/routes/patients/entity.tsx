import { useOpenLibrechatDavid } from 'librechat/librechat-david-modal';
import PatientEntity from 'patient/entity/patient-entity';

const PatientEntityRoute = () => {
  const openDavid = useOpenLibrechatDavid();
  return <PatientEntity onAskAssistant={import.meta.env.APPS_LIBRECHAT ? openDavid : undefined} />;
};

export default PatientEntityRoute;

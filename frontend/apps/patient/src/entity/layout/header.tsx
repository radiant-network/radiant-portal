import HeaderNavigation from '@/components/base/navigation/header-navigation';
import { useI18n } from '@/components/hooks/i18n';
import { useLocalPath } from '@/components/hooks/use-local-path';

type HeaderProps = {
  patientId: string;
};

function Header({ patientId }: HeaderProps) {
  const { t } = useI18n();
  const localPath = useLocalPath();

  return (
    <HeaderNavigation
      isLoading={false}
      title={t('patient_entity.header.title', { id: patientId })}
      previousPageUrl={localPath('/patient')}
      variant="info"
    />
  );
}

export default Header;

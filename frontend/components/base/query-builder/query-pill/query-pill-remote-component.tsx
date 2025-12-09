import { useI18n } from '@/components/hooks/i18n';

function QueryPillRemoteComponent() {
  const { t } = useI18n();
  return <div>{t('common.components.query_pill_remote')}</div>;
}

export default QueryPillRemoteComponent;

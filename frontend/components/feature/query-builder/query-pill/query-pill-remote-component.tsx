import React from "react";
import { useI18n } from '@/components/hooks/i18n';

function QueryPillRemoteComponent() {
  const { t } = useI18n();
  return <div>{t('common.components.queryPillRemote')}</div>;
}

export default QueryPillRemoteComponent;

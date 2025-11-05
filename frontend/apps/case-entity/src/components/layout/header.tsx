import { Users } from 'lucide-react';

import { CaseEntity } from '@/api/api';
import PageHeader from '@/components/base/page/page-header';
import { useI18n } from '@/components/hooks/i18n';

export default function Header({ data, isLoading }: { data?: CaseEntity | null; isLoading: boolean }) {
  const { t } = useI18n();

  return (
    <PageHeader
      isLoading={isLoading}
      title={`${t('case_entity.header.case')} ${data?.case_id}`}
      badges={[
        {
          variant: 'secondary',
          className: 'h-5',
          children: (
            <>
              <Users />
              {t(`case_entity.header.${data?.case_type ?? 'unknown'}`)}
            </>
          ),
        },
        {
          variant: 'outline',
          className: 'h-5',
          children: data?.analysis_catalog_code,
          tooltipText: data?.analysis_catalog_name,
        },
      ]}
    />
  );
}

import { CaseEntity } from '@/api/api';
import { Users } from 'lucide-react';
import { useI18n } from '@/components/hooks/i18n';
import PageHeader from '@/components/base/page/page-header';

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
              {t(`caseEntity.header.${data?.case_type ?? 'unknown'}`)}
            </>
          ),
        },
        {
          variant: 'outline',
          className: 'h-5',
          children: data?.case_analysis_code,
          tooltipsText: data?.case_analysis_name,
        },
      ]}
    />
  );
}

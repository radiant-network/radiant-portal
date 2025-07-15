import { CaseEntity } from "@/api/api";
import { Users } from "lucide-react";
import { useI18n } from "@/components/hooks/i18n";
import PageHeader from "@/components/base/headers/page-header";

export default function Header({ data, isLoading }: { data?: CaseEntity | null, isLoading: boolean }) {
  const { t } = useI18n();

  return (
    <PageHeader
      isLoading={isLoading}
      title={`${t('caseEntity.header.case')} ${data?.case_id}`}
      breadcrumbs={[{
        to: '/case-exploration',
        text: t('caseEntity.header.cases')
      }]}
      badges={[{
        variant: "secondary",
        className: "h-5",
        children: <><Users />{t(`caseEntity.header.${data?.case_type ?? 'unknown'}`)}</>
      }, {
        variant: "outline",
        className: "h-5",
        children: data?.case_analysis_code
      }]}
    />
  )
}

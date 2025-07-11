import { CaseEntity } from "@/api/api";
import BackLink from '@/components/base/navigation/back-link';
import Container from "@/components/base/container";
import { Skeleton } from "@/components/base/ui/skeleton";
import { Badge } from "@/components/base/ui/badge";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/components/hooks/i18n";

export default function Header({ data, isLoading }: { data?: CaseEntity | null, isLoading: boolean }) {
  const { t } = useI18n();

  return (
    <div className="bg-background">
      <Container>
        <div className="flex flex-col gap-4 pt-6 px-6">
          <Link to="/case-exploration">
            <BackLink>{t('caseEntity.header.cases')}</BackLink>
          </Link>
          {isLoading ? (
            <Skeleton className="w-96 h-8" />
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{t('caseEntity.header.case')} {data?.case_id}</h1>
              <Badge variant="secondary" className="h-5"><Users />{t(`caseEntity.header.${data?.case_type ?? 'unknown'}`)}</Badge>
              <Badge variant="outline" className="h-5">{data?.case_analysis_code}</Badge>
            </div>
          )}
        </div>
      </Container>
    </div>);
}
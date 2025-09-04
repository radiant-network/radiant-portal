import { useI18n } from '@/components/hooks/i18n';

type RelationshipToProbandFieldProps = {
  relationship: string;
};
function RelationshipToProbandField({ relationship }: RelationshipToProbandFieldProps) {
  const { t } = useI18n();
  return <span className="capitalize">{t(`common.relationships.${relationship}`)}</span>;
}
export default RelationshipToProbandField;

import { useI18n } from "@/components/hooks/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';

function RelationHeader() {
  const { t } = useI18n();

  return (
    <div className="inline-flex gap-2 items-center px-6 py-6">
      <span>{t('caseEntity.variants.relation.assay')}</span>
      <Select
        value={"proband"}
        onValueChange={value => {
          console.log('value', value);
        }}
      >
        <SelectTrigger className="min-w-[125px] max-w-[200px] h-9">
          <SelectValue>proband</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {["proband", "mother", "father"].map(pageSize => (
            <SelectItem key={`page-size-${pageSize}`} value={String(pageSize)}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>78988989</div>
    </div>

  )
}

export default RelationHeader; 

import { Checkbox } from '@/components/base/ui/checkbox';
import { useI18n } from '@/components/hooks/i18n';
import { UniqueIdentifier } from '@dnd-kit/core';

type VisibilityColumnSettingProps = {
  id: UniqueIdentifier;
  checked: boolean;
  handleCheckboxChange: (target: string, checked: boolean) => void;
};

/**
 * VisibilityColumnSetting
 * - Manage column visibility
 */
function VisibilityColumnSetting({ id, checked, handleCheckboxChange }: VisibilityColumnSettingProps) {
  const { t } = useI18n();
  return (
    <>
      <Checkbox
        checked={checked}
        onCheckedChange={value => {
          handleCheckboxChange(id as string, !!value);
        }}
      />
      <label className="flex pl-[4px] text-[15px] leading-none">{t(`variant.headers.${id}`)}</label>
    </>
  );
}

export default VisibilityColumnSetting;

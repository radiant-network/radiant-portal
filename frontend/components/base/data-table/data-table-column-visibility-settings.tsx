import { UniqueIdentifier } from '@dnd-kit/core';

import { Checkbox } from '@/components/base/shadcn/checkbox';
import { useI18n } from '@/components/hooks/i18n';

type VisibilityColumnSettingProps = {
  id: UniqueIdentifier;
  checked: boolean;
  label?: string;
  handleCheckboxChange: (target: string, checked: boolean) => void;
};

/**
 * VisibilityColumnSetting
 * - Manage column visibility
 */
function VisibilityColumnSetting({ id, label, checked, handleCheckboxChange }: VisibilityColumnSettingProps) {
  const { t } = useI18n();
  return (
    <>
      <Checkbox
        checked={checked}
        onCheckedChange={value => {
          handleCheckboxChange(id as string, !!value);
        }}
      />
      {label && <label className="flex pl-[4px] text-[15px] leading-none">{t(label)}</label>}
    </>
  );
}

export default VisibilityColumnSetting;

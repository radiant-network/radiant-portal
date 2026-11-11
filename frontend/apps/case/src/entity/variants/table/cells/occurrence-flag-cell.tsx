import OccurrenceFlagDropdown, {
  type OccurrenceFlagDropdownProps,
} from '@/components/base/dropdowns/occurrence-flag-dropdown';

import { useCaseVariantPermissions } from '../../use-case-variant-permissions';

function OccurrenceFlagCell(props: OccurrenceFlagDropdownProps) {
  const { canFlag } = useCaseVariantPermissions();
  return <OccurrenceFlagDropdown size="2xs" variant="ghost" {...props} canFlag={canFlag} />;
}
export default OccurrenceFlagCell;

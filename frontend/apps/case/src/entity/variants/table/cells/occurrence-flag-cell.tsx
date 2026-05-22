import OccurrenceFlagDropdown, {
  OccurrenceFlagDropdownProps,
} from '@/components/base/dropdowns/occurrence-flag-dropdown';

function OccurrenceFlagCell(props: OccurrenceFlagDropdownProps) {
  return <OccurrenceFlagDropdown size="2xs" variant="ghost" {...props} />;
}
export default OccurrenceFlagCell;

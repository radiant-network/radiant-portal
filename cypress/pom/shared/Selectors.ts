/// <reference types="cypress"/>
export const CommonSelectors = {
  link: '[href], a',
  plusIcon: '[class*="lucide-plus"]',
  resetButton: 'button:contains("Reset")',
  settingsCheckbox: (value: string) => `[class*="items"]:contains("${value}") [role="checkbox"]`,
  settingsIcon: '[class*="lucide-settings"]',
  settingsPopper: '[class*="radix-dropdown-menu-content"]',
  sortIcon: '[class*="lucide-arrow-up"], [class*="lucide lucide-arrow-down"]',
  tableCellData: 'td',
  tableCellHead: 'th',
  tableHead: 'table thead',
  tablePagingCombobox: (tableID: string) => `[data-slot="card-content"]:has(#${tableID}) button[role="combobox"]`,
  tableResultsCount: (tableID: string) => `[data-slot="card-content"]:has(#${tableID}) [class="text-xs text-muted-foreground"]`,
  tableRow: 'table tbody tr',
  tooltipPopper: '[class*="radix-tooltip-content"]',
};

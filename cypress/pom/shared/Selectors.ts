/// <reference types="cypress"/>
export const CommonSelectors = {
    checkbox: '[type="checkbox"]',
    link: '[href], a',
    logo: 'img[alt="Logo"]',
    plusIcon: '[class*="lucide-plus"]',
    sortAscIcon: '[class="lucide-arrow-up"]',
    tableCell: 'td',
    tableHead: 'table thead',
    tablePagingCombobox: (tableID: string) => `[data-slot="card-content"]:has(#${tableID}) button[role="combobox"]`,
    tableResultsCount: (tableID: string) => `[data-slot="card-content"]:has(#${tableID}) [class="text-xs text-muted-foreground"]`,
    tableRow: 'table tbody tr',
  };
  
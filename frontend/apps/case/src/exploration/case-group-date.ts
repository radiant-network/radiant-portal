import { format } from 'date-fns';

export function formatCaseGroupDate(date: Date, language: string): string {
  return format(date, language.startsWith('fr') ? "yyyy-MM-dd HH'h'mm" : 'yyyy-MM-dd h:mm a');
}

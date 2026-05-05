import { MultiSelectorOption } from '@/components/base/data-entry/multi-selector/multi-selector.types';
import { BadgeProps } from '@/components/base/shadcn/badge';

export const classificationCriterias: (MultiSelectorOption & {
  color?: BadgeProps['variant'];
})[] = [
  {
    label: 'PVS1',
    value: 'PVS1',
    color: 'red',
    title: '',
  },
  {
    label: 'PS1',
    value: 'PS1',
    color: 'orange',
    title: '',
  },
  {
    label: 'PS2',
    value: 'PS2',
    color: 'orange',
    title: '',
  },
  {
    label: 'PS3',
    value: 'PS3',
    color: 'orange',
    title: '',
  },
  {
    label: 'PS4',
    value: 'PS4',
    color: 'orange',
    title: '',
  },
  {
    label: 'PM1',
    value: 'PM1',
    color: 'yellow',
    title: '',
  },
  {
    label: 'PM2',
    value: 'PM2',
    color: 'yellow',
    title: '',
  },
  {
    label: 'PM3',
    value: 'PM3',
    color: 'yellow',
    title: '',
  },
  {
    label: 'PM4',
    value: 'PM4',
    color: 'yellow',
    title: '',
  },
  {
    label: 'PM5',
    value: 'PM5',
    color: 'yellow',
    title: '',
  },
  {
    label: 'PM6',
    value: 'PM6',
    color: 'yellow',
    title: '',
  },
  {
    label: 'PP1',
    value: 'PP1',
    color: 'green',
    title: '',
  },
  {
    label: 'PP2',
    value: 'PP2',
    color: 'green',
    title: '',
  },
  {
    label: 'PP3',
    value: 'PP3',
    color: 'green',
    title: '',
  },
  {
    label: 'PP4',
    value: 'PP4',
    color: 'green',
    title: '',
  },
  {
    label: 'PP5',
    value: 'PP5',
    color: 'green',
    title: '',
  },
  {
    label: 'BA1',
    value: 'BA1',
    color: 'cyan',
    title: '',
  },
  {
    label: 'BS1',
    value: 'BS1',
    color: 'violet',
    title: '',
  },
  {
    label: 'BS2',
    value: 'BS2',
    color: 'violet',
    title: '',
  },
  {
    label: 'BS3',
    value: 'BS3',
    color: 'violet',
    title: '',
  },
  {
    label: 'BS4',
    value: 'BS4',
    color: 'violet',
    title: '',
  },
  {
    label: 'BP1',
    value: 'BP1',
    color: 'blue',
    title: '',
  },
  {
    label: 'BP2',
    value: 'BP2',
    color: 'blue',
    title: '',
  },
  {
    label: 'BP3',
    value: 'BP3',
    color: 'blue',
    title: '',
  },
  {
    label: 'BP4',
    value: 'BP4',
    color: 'blue',
    title: '',
  },
  {
    label: 'BP5',
    value: 'BP5',
    color: 'blue',
    title: '',
  },
  {
    label: 'BP6',
    value: 'BP6',
    color: 'blue',
    title: '',
  },
  {
    label: 'BP7',
    value: 'BP7',
    color: 'blue',
    title: '',
  },
];

export const getClassificationCriteriaColor = (value: string) =>
  classificationCriterias.find(criteria => criteria.value === value)?.color || undefined;

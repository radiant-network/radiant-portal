import { MultiSelectorOption } from '@/components/base/data-entry/multi-selector/multi-selector.types';
import { BadgeProps } from '@/components/base/shadcn/badge';

export const oncogenicityClassificationCriterias: (MultiSelectorOption & {
  color?: BadgeProps['variant'];
})[] = [
  {
    label: 'OVS1',
    value: 'OVS1',
    color: 'red',
    title: '',
  },
  {
    label: 'OS1',
    value: 'OS1',
    color: 'orange',
    title: '',
  },
  {
    label: 'OS2',
    value: 'OS2',
    color: 'orange',
    title: '',
  },
  {
    label: 'OS3',
    value: 'OS3',
    color: 'orange',
    title: '',
  },
  {
    label: 'OM1',
    value: 'OM1',
    color: 'blue',
    title: '',
  },
  {
    label: 'OM2',
    value: 'OM2',
    color: 'blue',
    title: '',
  },
  {
    label: 'OM3',
    value: 'OM3',
    color: 'blue',
    title: '',
  },
  {
    label: 'OM4',
    value: 'OM4',
    color: 'blue',
    title: '',
  },
  {
    label: 'OP1',
    value: 'OP1',
    color: 'green',
    title: '',
  },
  {
    label: 'OP2',
    value: 'OP2',
    color: 'green',
    title: '',
  },
  {
    label: 'OP3',
    value: 'OP3',
    color: 'green',
    title: '',
  },
  {
    label: 'OP4',
    value: 'OP4',
    color: 'green',
    title: '',
  },
  {
    label: 'SBVS1',
    value: 'SBVS1',
    color: 'violet',
    title: '',
  },
  {
    label: 'SBS1',
    value: 'SBS1',
    color: 'violet',
    title: '',
  },
  {
    label: 'SBS2',
    value: 'SBS2',
    color: 'violet',
    title: '',
  },
  {
    label: 'SBP1',
    value: 'SBP1',
    color: 'cyan',
    title: '',
  },
  {
    label: 'SBP2',
    value: 'SBP2',
    color: 'cyan',
    title: '',
  },
];

export const getOncogenicityClassificationCriteriaColor = (value: string) =>
  oncogenicityClassificationCriterias.find(criteria => criteria.value === value)?.color || undefined;

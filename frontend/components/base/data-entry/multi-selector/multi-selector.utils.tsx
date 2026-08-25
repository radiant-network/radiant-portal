import type { MultiSelectorGroupOption, MultiSelectorOption } from './multi-selector.types';

/**
 * Identifies a set of grouped options so two sets can be compared without serializing them.
 * Text labels are kept in the signature, so renaming an option still refreshes the list.
 */
export function getGroupOptionSignature(groupOption: MultiSelectorGroupOption) {
  return Object.entries(groupOption)
    .map(([group, options]) => {
      const signatures = options.map(
        option => `${option.value}~${typeof option.label === 'string' ? option.label : ''}`,
      );
      return `${group}:${signatures.join(',')}`;
    })
    .join('|');
}

export function transToGroupOption(options: MultiSelectorOption[], groupBy?: string) {
  if (options.length === 0) {
    return {};
  }
  if (!groupBy) {
    return {
      '': options,
    };
  }

  const groupOption: MultiSelectorGroupOption = {};
  options.forEach(option => {
    const key = (option[groupBy] as string) || '';
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key].push(option);
  });
  return groupOption;
}

export function getSelectedOptionByValue(value: string[], options: MultiSelectorOption[]): MultiSelectorOption[] {
  return options.filter(option => value.includes(option.value));
}

export function isOptionsExist(groupOption: MultiSelectorGroupOption, targetOption: MultiSelectorOption[]) {
  for (const [, value] of Object.entries(groupOption)) {
    if (value.some(option => targetOption.find(p => p.value === option.value))) {
      return true;
    }
  }
  return false;
}

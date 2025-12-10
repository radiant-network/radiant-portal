import { Command as CommandPrimitive } from 'cmdk';

import { Command } from '@/components/base/shadcn/command';

export interface MultiSelectorOption {
  value: string;
  label: string;
  fixed?: boolean;
  disable?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}

export interface MultiSelectorGroupOption {
  [key: string]: MultiSelectorOption[];
}

export interface MultipleSelectorProps {
  ref?: React.RefCallback<MultipleSelectorRef> | React.RefObject<MultipleSelectorRef>;
  value?: string[];
  defaultOptions?: MultiSelectorOption[];
  /** manually controlled options */
  options?: MultiSelectorOption[];
  placeholder?: string;
  /** Empty component. */
  emptyIndicator?: React.ReactNode;
  /** Debounce time for async search. Only work with `onSearch`. */
  debounceDelay?: number;
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean;
  /** async search */
  onSearch?: (value: string) => Promise<MultiSelectorOption[]>;
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   **/
  onSearchSync?: (value: string) => MultiSelectorOption[];
  onChange?: (options: string[]) => void;
  /** Limit the maximum number of selected options. */
  maxSelected?: number;
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void;
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean;
  disabled?: boolean;
  /** Group the options base on provided key. */
  groupBy?: string;
  className?: string;
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean;
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean;
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    'value' | 'placeholder' | 'disabled'
  >;
  /** hide the clear all button. */
  hideClearAllButton?: boolean;

  /**
   * Render the badge for each option.
   */
  renderBadge?: (params: { option: MultiSelectorOption; onRemove: () => void }) => React.ReactNode;
}

export interface MultipleSelectorRef {
  selectedValue: MultiSelectorOption[];
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
}

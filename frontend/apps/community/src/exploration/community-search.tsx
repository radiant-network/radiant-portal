import { Search, X } from 'lucide-react';

import { Input } from '@/components/base/shadcn/input';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

type CommunitySearchProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

/**
 * Live search field: search icon on the left, and a clear button on the right
 * that appears once there is text. No autocomplete — filtering happens as you type.
 */
export default function CommunitySearch({ value, onValueChange, placeholder, className }: CommunitySearchProps) {
  const { t } = useI18n();

  return (
    <div className={cn('relative w-full', className)}>
      <Input
        startIcon={Search}
        value={value}
        onChange={event => onValueChange(event.target.value)}
        placeholder={placeholder}
        className={cn({ 'pr-8': value.length > 0 })}
        size="sm"
      />
      {value.length > 0 && (
        <button
          type="button"
          aria-label={t('common.actions.clear')}
          onClick={() => onValueChange('')}
          className="text-muted-foreground hover:text-foreground absolute right-2.5 top-1/2 -translate-y-1/2"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

type DescriptionSectionProps = {
  title: string;
  children: React.ReactNode;
  values?: any[];
  fullWidth?: boolean;
};

/**
 * If all values are undefined, display empty state
 */
function DescriptionSection({ title, children, values, fullWidth = true }: DescriptionSectionProps) {
  const { t } = useI18n();
  let isEmpty = false;
  if (values) {
    isEmpty = values.filter(e => !!e).length === 0;
  }

  return (
    <div className={cn('flex flex-col gap-1 items-start', { 'w-full': fullWidth })}>
      <h4 className="font-semibold text-sm">{title}</h4>
      <div className={cn('flex gap-3 items-center', { 'w-full': fullWidth })}>
        {isEmpty ? (
          <span className="text-muted-foreground text-xs">
            {t('common.empty_section', { title: title.toLowerCase() })}
          </span>
        ) : (
          <div className={cn('flex flex-col gap-2 items-start', { 'w-full': fullWidth })}>{children}</div>
        )}
      </div>
    </div>
  );
}

function DescriptionRow({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 w-full">
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className="flex items-center justify-end text-sm">{children}</div>
    </div>
  );
}

export { DescriptionRow, DescriptionSection };

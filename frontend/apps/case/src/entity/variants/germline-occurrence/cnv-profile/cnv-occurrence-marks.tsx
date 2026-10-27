import { MessageSquare } from 'lucide-react';

import type { OccurrenceFlagType } from '@/api/api';
import { FLAGS } from '@/components/base/dropdowns/occurrence-flag-dropdown';
import { useI18n } from '@/components/hooks/i18n';

type CNVOccurrenceMarksProps = {
  flag?: OccurrenceFlagType;
  hasNote: boolean;
  onNoteClick?: () => void;
};

/**
 * The flag of a CNV and whether it has comments, as the CNV table shows them, read only. With
 * onNoteClick, the comment mark is a button, as to scroll to the comments.
 */
function CNVOccurrenceMarks({ flag, hasNote, onNoteClick }: CNVOccurrenceMarksProps) {
  const { t } = useI18n();
  const flagConfig = flag ? FLAGS[flag] : undefined;
  if (!flagConfig && !hasNote) return null;
  return (
    <span className="inline-flex items-center gap-1">
      {flagConfig && (
        <span role="img" title={t('occurrence_flag.tooltip.flagged')} aria-label={t('occurrence_flag.tooltip.flagged')}>
          <flagConfig.Icon size={14} className={flagConfig.className} />
        </span>
      )}
      {hasNote && onNoteClick && (
        <button
          type="button"
          title={t('notes.variant.tooltip.view')}
          aria-label={t('notes.variant.tooltip.view')}
          className="cursor-pointer rounded-sm hover:bg-accent"
          onClick={onNoteClick}
        >
          <MessageSquare size={14} className="text-primary fill-primary/20" />
        </button>
      )}
      {hasNote && !onNoteClick && (
        <span role="img" title={t('notes.variant.tooltip.view')} aria-label={t('notes.variant.tooltip.view')}>
          <MessageSquare size={14} className="text-primary fill-primary/20" />
        </span>
      )}
    </span>
  );
}

export default CNVOccurrenceMarks;

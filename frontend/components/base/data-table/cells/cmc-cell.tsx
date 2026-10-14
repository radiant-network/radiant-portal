import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { useI18n } from '@/components/hooks/i18n';
import { toExponentialNotation } from '@/components/lib/number-format';

type CmcCellProps = {
  sampleMutated?: number;
  sampleRatio?: number;
  mutationUrl?: string;
};

function CmcCell({ sampleMutated, sampleRatio, mutationUrl }: CmcCellProps) {
  const { t } = useI18n();

  if (sampleMutated === undefined || sampleMutated === null) return <EmptyCell />;

  return (
    <span className="flex gap-1 items-center">
      {mutationUrl ? (
        <AnchorLink
          size="sm"
          href={mutationUrl}
          target="_blank"
          aria-label={t('a11y.cmc.open_cosmic', { count: sampleMutated })}
        >
          {sampleMutated}
        </AnchorLink>
      ) : (
        sampleMutated
      )}
      {sampleRatio !== undefined && sampleRatio !== null && (
        <span>({toExponentialNotation(sampleRatio) || sampleRatio})</span>
      )}
    </span>
  );
}

export default CmcCell;

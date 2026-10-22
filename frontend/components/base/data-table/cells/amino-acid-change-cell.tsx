import AminoAcidChange from '@/components/base/variant/amino-acid-change';

import EmptyCell from './empty-cell';

type AminoAcidChangeCellProps = {
  value?: string;
  description?: string;
  className?: string;
};

function AminoAcidChangeCell({ value, description, className }: AminoAcidChangeCellProps) {
  if (!value) return <EmptyCell />;

  return <AminoAcidChange value={value} description={description} className={className} />;
}

export default AminoAcidChangeCell;

import CmcTierBadge from '@/components/base/badges/cmc-tier-badge';

type CmcTierCellProps = {
  tier?: string;
  locus: string;
};

// locus in VCF representation: chromosome-position-reference-alternate
function CmcTierCell({ tier, locus }: CmcTierCellProps) {
  return (
    <CmcTierBadge value={tier} href={`https://franklin.genoox.com/clinical-db/variant/snpTumor/chr${locus}-hg38`} />
  );
}

export default CmcTierCell;

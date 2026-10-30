import { Trans } from 'react-i18next';

import AnchorLink from '@/components/base/navigation/anchor-link';

type GuidesInfoCardProps = {
  i18nKey: string;
  href: string;
};

function GuidesInfoCard({ i18nKey, href }: GuidesInfoCardProps) {
  return (
    <div className="leading-6">
      <Trans
        i18nKey={i18nKey}
        components={{
          guides: (
            // eslint-disable-next-line jsx-a11y/anchor-has-content -- text injected by <Trans>
            <AnchorLink className="inline-flex no-underline hover:underline" href={href} target="_blank" size="sm" />
          ),
        }}
      />
    </div>
  );
}

export function GermlineClassificationInfoCard() {
  return (
    <GuidesInfoCard
      i18nKey="variant.interpretation_form.germline.classification_popover.full_text"
      href="https://pubmed.ncbi.nlm.nih.gov/25741868/"
    />
  );
}

export function OncogenicityInfoCard() {
  return (
    <GuidesInfoCard
      i18nKey="variant.interpretation_form.somatic.oncogenicity_popover.full_text"
      href="https://pubmed.ncbi.nlm.nih.gov/35101336/"
    />
  );
}

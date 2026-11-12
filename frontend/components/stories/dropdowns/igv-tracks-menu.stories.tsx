/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import IGVTracksMenu from '@/components/base/igv/igv-tracks-menu';

import { StorySection, StoryShowcase } from '../story-section';

const SNV_TRACKS = [{ id: 'clinvar', name: 'ClinVar' }];

const CNV_TRACKS = [
  { id: 'dgv', name: 'DGV' },
  { id: 'clinvar_sv', name: 'ClinVar SVs' },
  { id: 'clingen_region_haploinsufficiency', name: 'ClinGen region haploinsufficiency' },
  { id: 'clingen_region_triplosensitivity', name: 'ClinGen region triplosensitivity' },
  { id: 'gnomad_sv', name: 'gnomAD SV v4.1' },
  { id: 'gnomad_cnv', name: 'gnomAD CNV v4.1' },
  { id: 'clingen_gene_haploinsufficiency', name: 'ClinGen gene haploinsufficiency' },
  { id: 'clingen_gene_triplosensitivity', name: 'ClinGen gene triplosensitivity' },
  { id: 'segmental_duplications', name: 'Segmental duplications' },
  { id: 'repeat_masker', name: 'RepeatMasker' },
  { id: 'simple_repeats', name: 'Simple repeats' },
  { id: 'self_chain', name: 'Self chain' },
];

const meta = {
  title: 'Components/Dropdowns/IGV Tracks Menu',
  component: IGVTracksMenu,
  args: {
    tracks: CNV_TRACKS,
    shownTrackIds: [],
    onShownChange: () => {},
  },
} satisfies Meta<typeof IGVTracksMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [snvShownIds, setSNVShownIds] = useState<string[]>([]);
    const [cnvShownIds, setCNVShownIds] = useState<string[]>(CNV_TRACKS.slice(0, 4).map(({ id }) => id));

    return (
      <StoryShowcase direction="row">
        <StorySection title="From an SNV" description="ClinVar only, switched off by default.">
          <IGVTracksMenu
            tracks={SNV_TRACKS}
            shownTrackIds={snvShownIds}
            onShownChange={(id, shown) =>
              setSNVShownIds(ids => (shown ? [...ids, id] : ids.filter(shownId => shownId !== id)))
            }
          />
        </StorySection>
        <StorySection
          title="From a CNV"
          description="12 tracks, the first four switched on by default. The menu stays open to switch several tracks."
        >
          <IGVTracksMenu
            tracks={CNV_TRACKS}
            shownTrackIds={cnvShownIds}
            onShownChange={(id, shown) =>
              setCNVShownIds(ids => (shown ? [...ids, id] : ids.filter(shownId => shownId !== id)))
            }
          />
        </StorySection>
      </StoryShowcase>
    );
  },
};

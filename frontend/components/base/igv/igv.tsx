import { useEffect, useRef, useState } from 'react';
import type { Browser, TrackLoad, TrackType } from 'igv';
import { toast } from 'sonner';

import { useI18n } from '@/components/hooks/i18n';

import { throttleAlignmentRequests } from './alignment-request-throttle';
import { type AlignmentTrack, applyChrMDensityRule, countChrMSlices } from './chrm-density';
import type { IGVReference, IGVTrack } from './types';

import './igv.css';

const HG38_REFERENCE: IGVReference = {
  id: 'hg38_1kg',
  ucscID: 'hg38',
  blatDB: 'hg38',
  name: 'Human (hg38 1kg/GATK)',
  fastaURL:
    'https://1000genomes.s3.amazonaws.com/technical/reference/GRCh38_reference_genome' +
    '/GRCh38_full_analysis_set_plus_decoy_hla.fa',
  indexURL:
    'https://1000genomes.s3.amazonaws.com/technical/reference/GRCh38_reference_genome' +
    '/GRCh38_full_analysis_set_plus_decoy_hla.fa.fai',
  cytobandURL: 'https://s3.amazonaws.com/igv.org.genomes/hg38/annotations/cytoBandIdeo.txt.gz',
  tracks: [
    {
      name: 'Refseq Genes',
      format: 'refgene',
      url: 'https://s3.amazonaws.com/igv.org.genomes/hg38/ncbiRefSeq.sorted.txt.gz',
      indexURL: 'https://s3.amazonaws.com/igv.org.genomes/hg38/ncbiRefSeq.sorted.txt.gz.tbi',
      order: 0,
      visibilityWindow: -1,
      displayMode: 'EXPANDED',
      autoHeight: true,
      maxHeight: 160,
    },
  ],
};

type ReferenceFrame = { chr: string; start: number; end: number };

type IGVProps = {
  id?: string;
  className?: string;
  locus: string;
  tracks: IGVTrack[];
};

const IGV = ({ id = 'igvContainer', className = '', locus, tracks }: IGVProps) => {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const browserLocus = useRef(locus);
  const caseTracksLoaded = useRef(false);
  const chrMSliceCounts = useRef(new Map<AlignmentTrack, number>());
  const [browser, setBrowser] = useState<Browser>();
  const [chrMHiddenReadsWindow, setChrMHiddenReadsWindow] = useState<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let removeBrowser: (() => void) | undefined;

    throttleAlignmentRequests();
    import('igv').then(async ({ default: igv }) => {
      if (cancelled) return;
      const created = await igv.createBrowser(container, { reference: HG38_REFERENCE, locus: browserLocus.current });
      if (cancelled) {
        igv.removeBrowser(created);
        return;
      }
      created.on('locuschange', ([view]: ReferenceFrame[]) => {
        const alignmentTracks = created.findTracks('type', 'alignment') as AlignmentTrack[];
        setChrMHiddenReadsWindow(applyChrMDensityRule(alignmentTracks, chrMSliceCounts.current, view));
      });
      removeBrowser = () => igv.removeBrowser(created);
      setBrowser(created);
    });

    return () => {
      cancelled = true;
      removeBrowser?.();
    };
  }, []);

  // Loaded once per browser: a refetch brings the same files with new presigned URLs.
  useEffect(() => {
    if (!browser || tracks.length === 0 || caseTracksLoaded.current) return;
    caseTracksLoaded.current = true;

    tracks.forEach((track, index) => {
      browser
        .loadTrack({ ...track, order: index + 1 } as TrackLoad<TrackType>)
        .then(async loaded => {
          if (loaded.type !== 'alignment') return;
          const sliceCount = await countChrMSlices(loaded as AlignmentTrack);
          if (sliceCount !== undefined) chrMSliceCounts.current.set(loaded as AlignmentTrack, sliceCount);
        })
        // igv.js logs a failed load, and a track without a slice count stays unrestricted.
        .catch(() => undefined);
    });
  }, [browser, tracks]);

  useEffect(() => {
    if (!browser || locus === browserLocus.current) return;
    browserLocus.current = locus;
    browser.search(locus);
  }, [browser, locus]);

  useEffect(() => {
    if (chrMHiddenReadsWindow === undefined) return;
    toast.warning(t('variant.igv.chrm_hidden_reads.title'), {
      description: t('variant.igv.chrm_hidden_reads.description', { window: chrMHiddenReadsWindow.toLocaleString() }),
    });
  }, [chrMHiddenReadsWindow, t]);

  return <div id={id} ref={containerRef} className={className} />;
};

export default IGV;

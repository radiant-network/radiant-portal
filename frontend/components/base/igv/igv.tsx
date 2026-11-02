import { useEffect, useRef, useState } from 'react';
import type { Browser, Tracks } from 'igv';
import { toast } from 'sonner';

import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';

import { throttleAlignmentRequests } from './alignment-request-throttle';
import { type CaseTrack, loadCaseTracks } from './case-tracks';
import {
  type AlignmentSettings,
  type AlignmentTrack,
  applyChrMDensityRule,
  CHRM,
  countChrMSlices,
} from './chrm-density';
import type { IGVReference } from './types';

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
      // igv.js reads refGene files, which its types leave out.
      format: 'refgene' as Tracks.AnnotationFormat,
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

const CHRM_HIDDEN_READS_TOAST_ID = 'igv-chrm-hidden-reads';
const FAILED_TRACKS_TOAST_ID = 'igv-failed-tracks';

type ReferenceFrame = { chr: string; start: number; end: number };

type IGVProps = {
  id?: string;
  className?: string;
  locus: string;
  tracks: CaseTrack[];
};

const IGV = ({ id = 'igvContainer', className = '', locus, tracks }: IGVProps) => {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const browserLocus = useRef(locus);
  const liveBrowser = useRef<Browser | undefined>(undefined);
  const caseTracksLoaded = useRef(false);
  const chrMSliceCounts = useRef(new Map<AlignmentTrack, number | undefined>());
  const chrMSavedSettings = useRef(new Map<AlignmentTrack, AlignmentSettings>());
  const [browser, setBrowser] = useState<Browser>();
  const [chrMHiddenReadsWindow, setChrMHiddenReadsWindow] = useState<number>();
  const [failedTrackNames, setFailedTrackNames] = useState<string[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let removeBrowser: (() => void) | undefined;

    throttleAlignmentRequests();
    import('igv').then(async ({ default: igv }) => {
      if (cancelled) return;
      // igv.js adds its sequence track to the reference tracks.
      const reference = structuredClone(HG38_REFERENCE);
      const created = await igv.createBrowser(container, { reference, locus: browserLocus.current });
      if (cancelled) {
        igv.removeBrowser(created);
        return;
      }
      created.on('locuschange', ([view]: ReferenceFrame[]) => {
        const alignmentTracks = created.findTracks('type', 'alignment') as AlignmentTrack[];
        setChrMHiddenReadsWindow(
          applyChrMDensityRule(alignmentTracks, chrMSliceCounts.current, chrMSavedSettings.current, view),
        );
      });
      liveBrowser.current = created;
      removeBrowser = () => {
        liveBrowser.current = undefined;
        igv.removeBrowser(created);
      };
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

    const { loads, failedTrackNames: failedNames } = loadCaseTracks(browser, tracks);
    failedNames.then(names => {
      if (liveBrowser.current === browser) setFailedTrackNames(names);
    });

    const countedTracks = loads.map((load, index) =>
      tracks[index].type !== 'alignment'
        ? load
        : load.then(async loaded => {
            const alignmentTrack = loaded as AlignmentTrack;
            chrMSliceCounts.current.set(alignmentTrack, await countChrMSlices(alignmentTrack));
          }),
    );
    // A track whose count fails keeps the smallest window on chrM.
    Promise.allSettled(countedTracks).then(() => {
      if (liveBrowser.current !== browser) return;
      // The rule runs on locus change: searching the current locus applies all the counts at once.
      const [currentLocus] = [browser.currentLoci()].flat();
      if (currentLocus.split(':')[0] === CHRM) browser.search(currentLocus);
    });
  }, [browser, tracks]);

  useEffect(() => {
    if (!browser || locus === browserLocus.current) return;
    browserLocus.current = locus;
    browser.search(locus);
  }, [browser, locus]);

  useEffect(() => {
    if (chrMHiddenReadsWindow === undefined) return;
    // A new window replaces the warning still shown instead of stacking a second one.
    toast.warning(t('variant.igv.chrm_hidden_reads.title'), {
      id: CHRM_HIDDEN_READS_TOAST_ID,
      description: t('variant.igv.chrm_hidden_reads.description', {
        window: thousandNumberFormat(chrMHiddenReadsWindow),
      }),
    });
  }, [chrMHiddenReadsWindow, t]);

  useEffect(() => {
    if (failedTrackNames.length === 0) return;
    toast.error(t('variant.igv.failed_tracks.title', { count: failedTrackNames.length }), {
      id: FAILED_TRACKS_TOAST_ID,
      description: failedTrackNames.join(', '),
    });
  }, [failedTrackNames, t]);

  return <div id={id} ref={containerRef} className={className} />;
};

export default IGV;

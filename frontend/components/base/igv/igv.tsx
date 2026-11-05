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
import { createPublicTrackLoader, type PublicTrack, type PublicTrackId } from './public-tracks';
import { applyReadsDisplayMode, getInitialReadsDisplayMode, withReadsDisplayMode } from './reads-display-mode';
import type { IGVContext, IGVReference } from './types';

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
  // The chromosome menu lists these only: the fasta also holds alt, random and decoy contigs, and igv.js would drop chrM.
  chromosomeOrder: [...Array.from({ length: 22 }, (_, i) => `chr${i + 1}`), 'chrX', 'chrY', 'chrM'],
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

// The message lists every track that failed since the dialog opened.
const withFailedTrackNames = (names: string[]) => (failed: string[]) =>
  names.length === 0 ? failed : [...new Set([...failed, ...names])];

type IGVProps = {
  id?: string;
  className?: string;
  locus: string;
  context: IGVContext;
  tracks: CaseTrack[];
  publicTracks: PublicTrack[];
  onPublicTrackRemoved: (id: PublicTrackId) => void;
};

const IGV = ({
  id = 'igvContainer',
  className = '',
  locus,
  context,
  tracks,
  publicTracks,
  onPublicTrackRemoved,
}: IGVProps) => {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const browserLocus = useRef(locus);
  const liveBrowser = useRef<Browser | undefined>(undefined);
  const publicTrackLoader = useRef<ReturnType<typeof createPublicTrackLoader> | undefined>(undefined);
  const publicTrackRemoved = useRef(onPublicTrackRemoved);
  const caseTracksLoaded = useRef(false);
  const readsDisplayMode = useRef(getInitialReadsDisplayMode(context, locus));
  const chrMSliceCounts = useRef(new Map<AlignmentTrack, number | undefined>());
  const chrMSavedSettings = useRef(new Map<AlignmentTrack, AlignmentSettings>());
  const [browser, setBrowser] = useState<Browser>();
  const [chrMHiddenReadsWindow, setChrMHiddenReadsWindow] = useState<number>();
  const [failedTrackNames, setFailedTrackNames] = useState<string[]>([]);

  useEffect(() => {
    publicTrackRemoved.current = onPublicTrackRemoved;
  }, [onPublicTrackRemoved]);

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
      // igv.js reads showAllChromosomes, which its types leave out.
      const options = { reference, locus: browserLocus.current, showAllChromosomes: false };
      const created = await igv.createBrowser(container, options);
      if (cancelled) {
        igv.removeBrowser(created);
        return;
      }
      created.on('locuschange', ([view]: ReferenceFrame[]) => {
        const alignmentTracks = created.findTracks('type', 'alignment') as AlignmentTrack[];
        readsDisplayMode.current = applyReadsDisplayMode(
          alignmentTracks,
          readsDisplayMode.current,
          view.end - view.start,
        );
        setChrMHiddenReadsWindow(
          applyChrMDensityRule(alignmentTracks, chrMSliceCounts.current, chrMSavedSettings.current, view),
        );
      });
      const loader = createPublicTrackLoader(created, name => {
        if (liveBrowser.current === created) setFailedTrackNames(withFailedTrackNames([name]));
      });
      // igv.js passes the removed track itself, not the array of its types.
      created.on('trackremoved', removed => {
        const removedId = loader.forget(removed as unknown as Tracks.Track);
        if (removedId) publicTrackRemoved.current(removedId);
      });
      liveBrowser.current = created;
      publicTrackLoader.current = loader;
      removeBrowser = () => {
        liveBrowser.current = undefined;
        publicTrackLoader.current = undefined;
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

    const { loads, failedTrackNames: failedNames } = loadCaseTracks(
      browser,
      withReadsDisplayMode(tracks, readsDisplayMode.current),
    );
    failedNames.then(names => {
      if (liveBrowser.current === browser) setFailedTrackNames(withFailedTrackNames(names));
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
    if (browser) publicTrackLoader.current?.sync(publicTracks);
  }, [browser, publicTracks]);

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

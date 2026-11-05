import { type ReactNode, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import type { IGVTracks } from '@/api/api';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/base/shadcn/dialog';
import { Spinner } from '@/components/base/spinner';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { igvApi } from '@/utils/api';

import { buildCaseTracks } from './case-tracks';
import IGV from './igv';
import IGVTracksMenu from './igv-tracks-menu';
import { buildPublicTracks, type PublicTrackId } from './public-tracks';
import type { IGVContext } from './types';

type IGVDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  caseId: number;
  seqId: number;
  locus: string;
  start: number;
  end?: number;
  chromosome: string;
  context: IGVContext;
  renderTrigger?: (handleOpen: () => void) => ReactNode;
};

const fetchIGVForCaseId = async ({ caseId }: { caseId: number }, tenant: string) =>
  igvApi.getIGV(tenant, caseId.toString()).then(response => response.data);

const IGVDialog = ({
  caseId,
  seqId,
  locus,
  start,
  end,
  chromosome,
  context,
  open,
  setOpen,
  renderTrigger,
}: IGVDialogProps) => {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const fetchIGV = useSWR<IGVTracks>(
    {
      key: `igv-${caseId}-${seqId}-${locus}`,
      caseId: caseId,
    },
    ({ caseId }: { caseId: number }) => fetchIGVForCaseId({ caseId }, tenant),
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      shouldRetryOnError: false,
    },
  );

  // Back to the defaults at each opening.
  const [shownPublicTrackIds, setShownPublicTrackIds] = useState<PublicTrackId[]>();

  const caseTracks = useMemo(() => buildCaseTracks(fetchIGV.data), [fetchIGV.data]);
  const publicTrackOptions = useMemo(
    () => buildPublicTracks(context, fetchIGV.data?.public_tracks, id => t(`variant.igv.public_tracks.${id}`)),
    [context, fetchIGV.data, t],
  );
  const shownIds = useMemo(
    () =>
      shownPublicTrackIds ??
      publicTrackOptions.filter(({ shownByDefault }) => shownByDefault).map(({ track }) => track.id),
    [shownPublicTrackIds, publicTrackOptions],
  );
  const publicTracks = useMemo(
    () => publicTrackOptions.map(({ track }) => track).filter(track => shownIds.includes(track.id)),
    [publicTrackOptions, shownIds],
  );

  useEffect(() => {
    if (open) {
      setShownPublicTrackIds(undefined);
      fetchIGV.mutate();
    }
  }, [open]);

  const handlePublicTrackShownChange = (id: PublicTrackId, shown: boolean) =>
    setShownPublicTrackIds(shown ? [...shownIds, id] : shownIds.filter(shownId => shownId !== id));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {renderTrigger?.(() => setOpen(true))}
      <DialogContent size="full" variant="stickyHeader">
        {/* The cached response of an earlier opening may hold expired URLs: IGV waits for the refetch. */}
        {fetchIGV.isValidating ? (
          <DialogBody className="flex items-center justify-center">
            <Spinner size={32} />
          </DialogBody>
        ) : (
          <div>
            <DialogHeader>
              <div className="flex items-center gap-4">
                <DialogTitle>{t('variant.igv.title')}</DialogTitle>
                {publicTrackOptions.length > 0 && (
                  <IGVTracksMenu
                    tracks={publicTrackOptions.map(({ track }) => track)}
                    shownTrackIds={shownIds}
                    onShownChange={handlePublicTrackShownChange}
                  />
                )}
              </div>
            </DialogHeader>
            <DialogBody className="relative max-h-[85vh] overflow-y-auto">
              <IGV
                tracks={caseTracks}
                context={context}
                publicTracks={publicTracks}
                onPublicTrackRemoved={id => handlePublicTrackShownChange(id, false)}
                locus={formatLocus(start, chromosome, 100, end)}
              />
            </DialogBody>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const formatLocus = (start: number, chromosome: string, bound?: number, end?: number) =>
  `chr${chromosome}:${bound ? `${start - bound}-${end ? end + bound : start + bound}` : start}`;

export default IGVDialog;

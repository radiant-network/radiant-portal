import { createContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { CaseAssay, CaseEntity } from '@/api/api';

import AssayVariantFilters from './filters/assay-variant-filters';
import CNVTab from './occurrence/cnv-tab';
import SNVTab from './occurrence/snv-tab';

export const SeqIDContext = createContext<number>(-1);

export enum VariantInterface {
  SNV = 'snv',
  CNV = 'cnv',
}

type VariantTabProps = {
  caseEntity?: CaseEntity;
  isLoading: boolean;
};

function VariantTab({ caseEntity, isLoading }: VariantTabProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeInterface, setActiveInterface] = useState<VariantInterface>(VariantInterface.SNV);
  const [patientSelected, setPatientSelected] = useState<CaseAssay | undefined>(undefined);

  // only use assay with variants
  const assaysWithVariants = caseEntity?.assays.filter(assay => assay.has_variants) ?? [];

  let defaultSeqId = Number(searchParams.get('seq_id')) ?? -1;
  if (!defaultSeqId && assaysWithVariants[0]?.seq_id) {
    defaultSeqId = assaysWithVariants[0]?.seq_id;
  }
  const [seqId, setSeqId] = useState<number>(defaultSeqId);

  /**
   * Set proband based on searchParams
   */
  useEffect(() => {
    if (searchParams.get('seq_id') != null) {
      setSeqId(Number(searchParams.get('seq_id')) ?? -1);
      return;
    }

    const assays = caseEntity?.assays ?? [];
    if (assays.length === 0) return;

    const assaysWithVariants = assays.filter(assay => assay.has_variants);
    if (assaysWithVariants.length === 0) return;

    setSeqId(assaysWithVariants[0].seq_id);
  }, [searchParams, caseEntity]);

  return (
    <SeqIDContext value={seqId}>
      <div className="bg-background flex flex-col">
        <AssayVariantFilters
          isLoading={isLoading}
          assays={assaysWithVariants}
          value={seqId}
          handleChange={(value: number) => {
            searchParams.set('seq_id', `${value}`);
            setSearchParams(searchParams, { replace: true });
            setSeqId(value);
            setPatientSelected(assaysWithVariants.find(assay => assay.seq_id === value));
          }}
          activeInterface={activeInterface}
          onActiveInterfaceChange={setActiveInterface}
        />

        {activeInterface == VariantInterface.SNV && <SNVTab seqId={seqId} patientSelected={patientSelected} />}
        {activeInterface == VariantInterface.CNV && <CNVTab seqId={seqId} />}
      </div>
    </SeqIDContext>
  );
}

export default VariantTab;

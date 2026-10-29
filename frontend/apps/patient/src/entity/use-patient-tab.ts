import useSWR from 'swr';

import type { ApiError } from '@/api/api';
import { useTenant } from '@/components/hooks/use-tenant';
import { usePatientIdFromParam } from '@/utils/helper';

import {
  fetchPatientGenomics,
  fetchPatientImaging,
  fetchPatientLaboratory,
  fetchPatientTreatments,
} from '../api/patient';

type PatientTabInput = {
  key: string;
  tenant: string;
  patientKey: string;
};

// Each tab reads its own endpoint, so only the tabs a user opens are fetched
function usePatientTab<T>(key: string, fetcher: (tenant: string, patientKey: string) => Promise<T>) {
  const { tenant } = useTenant();
  const patientKey = usePatientIdFromParam();

  return useSWR<T, ApiError, PatientTabInput>(
    { key, tenant, patientKey },
    input => fetcher(input.tenant, input.patientKey),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );
}

export const usePatientTreatments = () => usePatientTab('patient-treatments', fetchPatientTreatments);
export const usePatientLaboratory = () => usePatientTab('patient-laboratory', fetchPatientLaboratory);
export const usePatientImaging = () => usePatientTab('patient-imaging', fetchPatientImaging);
export const usePatientGenomics = () => usePatientTab('patient-genomics', fetchPatientGenomics);

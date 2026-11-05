import useSWR from 'swr';

import type { ApiError } from '@/api/api';
import { useTenant } from '@/components/hooks/use-tenant';
import { usePatientIdFromParam } from '@/utils/helper';

import {
  fetchPatientExternalRecords,
  fetchPatientGenomics,
  fetchPatientImaging,
  fetchPatientLaboratory,
  fetchPatientTreatments,
  fetchPatientTrialEligibilities,
} from '../../api/patient';

type PatientEntityInput = {
  key: string;
  tenant: string;
  patientKey: string;
};

export function usePatientEntity<T>(key: string, fetcher: (tenant: string, patientKey: string) => Promise<T>) {
  const { tenant } = useTenant();
  const patientKey = usePatientIdFromParam();

  return useSWR<T, ApiError, PatientEntityInput>(
    { key, tenant, patientKey },
    input => fetcher(input.tenant, input.patientKey),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );
}

export const usePatientTreatments = () => usePatientEntity('patient-treatments', fetchPatientTreatments);
export const usePatientLaboratory = () => usePatientEntity('patient-laboratory', fetchPatientLaboratory);
export const usePatientImaging = () => usePatientEntity('patient-imaging', fetchPatientImaging);
export const usePatientGenomics = () => usePatientEntity('patient-genomics', fetchPatientGenomics);
export const usePatientExternalRecords = () =>
  usePatientEntity('patient-external-records', fetchPatientExternalRecords);
export const usePatientTrialEligibilities = () =>
  usePatientEntity('patient-trial-eligibilities', fetchPatientTrialEligibilities);

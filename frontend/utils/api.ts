import {
  AssaysApi,
  CasesApi,
  Configuration,
  DocumentsApi,
  IgvApi,
  InterpretationsApi,
  MondoApi,
  OccurrencesApi,
  SavedFiltersApi,
  VariantApi,
} from '../api';
import { BASE_PATH } from '../api/base';

import { axiosClient } from './axios';

const config = new Configuration({
  basePath: '/api',
});

export const variantsApi = new VariantApi(config, BASE_PATH, axiosClient);
export const occurrencesApi = new OccurrencesApi(config, BASE_PATH, axiosClient);
export const interpretationApi = new InterpretationsApi(config, BASE_PATH, axiosClient);
export const mondoApi = new MondoApi(config, BASE_PATH, axiosClient);
export const caseApi = new CasesApi(config, BASE_PATH, axiosClient);
export const documentApi = new DocumentsApi(config, BASE_PATH, axiosClient);
export const savedFiltersApi = new SavedFiltersApi(config, BASE_PATH, axiosClient);
export const assayApi = new AssaysApi(config, BASE_PATH, axiosClient);
export const igvApi = new IgvApi(config, BASE_PATH, axiosClient);

import {
  ActionsApi,
  AuthApi,
  CasesApi,
  Configuration,
  DocumentsApi,
  GenesApi,
  IgvApi,
  InterpretationsApi,
  MondoApi,
  OccurrenceFlagsApi,
  OccurrenceNotesApi,
  OccurrencesApi,
  OrganizationsApi,
  RolesApi,
  SavedFiltersApi,
  SequencingApi,
  UserPreferencesApi,
  UsersApi,
  ValueSetsApi,
  VariantApi,
} from '../api';
import { BASE_PATH } from '../api/base';

import { axiosClient } from './axios';

const config = new Configuration({
  basePath: '/api',
});

export const authApi = new AuthApi(config, BASE_PATH, axiosClient);
export const variantsApi = new VariantApi(config, BASE_PATH, axiosClient);
export const occurrenceFlagApi = new OccurrenceFlagsApi(config, BASE_PATH, axiosClient);
export const occurrencesApi = new OccurrencesApi(config, BASE_PATH, axiosClient);
export const occurencesNotesApi = new OccurrenceNotesApi(config, BASE_PATH, axiosClient);
export const organizationsApi = new OrganizationsApi(config, BASE_PATH, axiosClient);
export const interpretationApi = new InterpretationsApi(config, BASE_PATH, axiosClient);
export const userPreferenceApi = new UserPreferencesApi(config, BASE_PATH, axiosClient);
export const mondoApi = new MondoApi(config, BASE_PATH, axiosClient);
export const caseApi = new CasesApi(config, BASE_PATH, axiosClient);
export const documentApi = new DocumentsApi(config, BASE_PATH, axiosClient);
export const savedFiltersApi = new SavedFiltersApi(config, BASE_PATH, axiosClient);
export const sequencingApi = new SequencingApi(config, BASE_PATH, axiosClient);
export const igvApi = new IgvApi(config, BASE_PATH, axiosClient);
export const genesApi = new GenesApi(config, BASE_PATH, axiosClient);
export const valueSetsApi = new ValueSetsApi(config, BASE_PATH, axiosClient);
export const usersApi = new UsersApi(config, BASE_PATH, axiosClient);
export const rolesApi = new RolesApi(config, BASE_PATH, axiosClient);
export const actionsApi = new ActionsApi(config, BASE_PATH, axiosClient);

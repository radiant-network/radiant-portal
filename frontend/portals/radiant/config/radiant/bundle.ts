import type { BundleDefinition } from '../catalog';

export const radiantBundle = {
  apps: ['VARIANT', 'CASE', 'FILE_ARCHIVE', 'ANALYSIS', 'ADMIN', 'PATIENT', 'STUDY', 'COMMUNITY'],
  home: 'PATIENT',
  extras: ['PROXY_YAC'],
} satisfies BundleDefinition;

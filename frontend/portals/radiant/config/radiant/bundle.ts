import type { BundleDefinition } from '../catalog';

export const radiantBundle = {
  apps: ['VARIANT', 'CASE', 'FILE_ARCHIVE', 'ANALYSIS', 'ADMIN', 'PATIENT', 'STUDY', 'COMMUNITY', 'LIBRECHAT'],
  extras: ['PROXY_YAC'],
} satisfies BundleDefinition;

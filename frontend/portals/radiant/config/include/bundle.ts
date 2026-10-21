import type { BundleDefinition } from '../catalog';

export const includeBundle = {
  apps: ['VARIANT', 'CASE', 'FILE_ARCHIVE', 'ANALYSIS', 'ADMIN', 'PATIENT', 'STUDY', 'COMMUNITY'],
  landing: 'INCLUDE',
  extras: [],
} satisfies BundleDefinition;

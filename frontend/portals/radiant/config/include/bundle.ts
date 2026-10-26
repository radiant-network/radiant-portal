import type { BundleDefinition } from '../catalog';

export const includeBundle = {
  apps: ['VARIANT', 'CASE', 'FILE_ARCHIVE', 'ANALYSIS', 'ADMIN', 'PATIENT', 'STUDY', 'COMMUNITY', 'LIBRECHAT'],
  landing: 'INCLUDE',
  extras: [],
} satisfies BundleDefinition;

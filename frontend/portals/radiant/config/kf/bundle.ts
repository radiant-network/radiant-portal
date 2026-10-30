import type { BundleDefinition } from '../catalog';

export const kfBundle = {
  apps: ['VARIANT', 'CASE', 'FILE_ARCHIVE', 'ANALYSIS', 'ADMIN', 'PATIENT', 'STUDY', 'COMMUNITY'],
  landing: 'KIDSFIRST',
  extras: [],
} satisfies BundleDefinition;

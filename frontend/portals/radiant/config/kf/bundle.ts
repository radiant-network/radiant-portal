import type { BundleDefinition } from '../catalog';

export const kfBundle = {
  apps: ['VARIANT', 'CASE', 'FILE_ARCHIVE', 'ANALYSIS', 'ADMIN', 'PATIENT', 'STUDY', 'COMMUNITY'],
  home: 'CASE',
  landing: 'KIDSFIRST',
  extras: [],
} satisfies BundleDefinition;

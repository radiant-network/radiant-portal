import type { BundleDefinition } from '../catalog';

export const qlinBundle = {
  apps: ['VARIANT', 'CASE', 'FILE_ARCHIVE', 'ANALYSIS', 'ADMIN'],
  home: 'CASE',
  extras: [],
} satisfies BundleDefinition;

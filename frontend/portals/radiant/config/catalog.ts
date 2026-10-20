export const APP_NAMES = [
  'VARIANT',
  'CASE',
  'FILE_ARCHIVE',
  'ANALYSIS',
  'ADMIN',
  'PATIENT',
  'STUDY',
  'COMMUNITY',
] as const;

export type AppName = (typeof APP_NAMES)[number];

export type LandingName = 'INCLUDE' | 'KIDSFIRST';

export type ExtraName = 'PROXY_YAC';

export type BundleDefinition = {
  apps: readonly AppName[];
  landing?: LandingName;
  extras: readonly ExtraName[];
};

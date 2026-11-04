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

export const HOME_PATHS = {
  CASE: 'case',
  PATIENT: 'patient',
} satisfies Partial<Record<AppName, string>>;

export type HomeName = keyof typeof HOME_PATHS;

export type BundleDefinition = {
  apps: readonly AppName[];
  home: HomeName;
  landing?: LandingName;
  extras: readonly ExtraName[];
};

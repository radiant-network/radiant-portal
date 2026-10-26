import type { AppName } from '../../config/catalog';

declare global {
  interface ViteTypeOptions {
    strictImportMetaEnv: unknown;
  }

  interface ImportMetaEnv extends Readonly<Record<`APPS_${AppName}`, boolean>> {
    readonly THEME: string;
    readonly APPS_LIBRECHAT_DAVID_URL: string;
    readonly DEFAULT_LANGUAGE: string;
  }
}

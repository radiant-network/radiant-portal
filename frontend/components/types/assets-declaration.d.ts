/// <reference types="vite/client" />

// For translations
declare module '@translations/common/*.json' {
  const value: Record<string, any>;
  export default value;
}

declare module '@translations/portals/*/*.json' {
  const value: Record<string, any>;
  export default value;
}

// For pre-merged translations (build-time generated)
declare module '@translations-merged/*.json' {
  const value: Record<string, any>;
  export default value;
}

// theme-declarations.d.ts
declare module '@assets/*' {
  const content: any;
  export default content;
}

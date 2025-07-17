/// <reference types="vite/client" />

// Translation JSON modules
declare module '@translations/common/*.json' {
  const content: Record<string, any>;
  export default content;
}

declare module '@translations/portals/*/*.json' {
  const content: Record<string, any>;
  export default content;
}

// theme-declarations.d.ts
declare module '@assets/*' {
  const content: any;
  export default content;
}

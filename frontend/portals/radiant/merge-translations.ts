import fs from 'fs';
import path from 'path';
import { deepMerge } from '../../components/lib/merge';

export const mergeTranslationsForTheme = (currentTheme: string, rootDir: string) => {
  console.log(`🔄 Merging translations for theme: ${currentTheme}`);
  
  const languages = ['en', 'fr'];
  for (const lang of languages) {
    try {
      // Read common translations
      const commonPath = path.resolve(rootDir, `../../translations/common/${lang}.json`);
      
      if (!fs.existsSync(commonPath)) {
        console.warn(`⚠️  Common translations not found: ${commonPath}`);
        continue;
      }
      
      const commonTranslations = JSON.parse(fs.readFileSync(commonPath, 'utf8'));
      
      // Read portal-specific translations
      const portalPath = path.resolve(rootDir, `../../translations/portals/${currentTheme}/${lang}.json`);
      let portalTranslations = {};
      
      if (fs.existsSync(portalPath)) {
        portalTranslations = JSON.parse(fs.readFileSync(portalPath, 'utf8'));
        console.log(`📄 Found portal translations: ${portalPath}`);
      } else {
        console.log(`📄 No portal translations found for ${currentTheme}/${lang}, using common only`);
      }
      
      // Merge translations using existing deepMerge utility
      const mergedTranslations = deepMerge(commonTranslations, portalTranslations);
      
      // Create merged directory if it doesn't exist
      const mergedDir = path.resolve(rootDir, `../../translations/merged/${currentTheme}`);
      if (!fs.existsSync(mergedDir)) {
        fs.mkdirSync(mergedDir, { recursive: true });
        console.log(`📁 Created directory: ${mergedDir}`);
      }
      
      // Write merged translations
      const mergedPath = path.resolve(mergedDir, `${lang}.json`);
      fs.writeFileSync(mergedPath, JSON.stringify(mergedTranslations, null, 2));
      
      console.log(`✅ Merged translations for ${currentTheme}/${lang}`);
    } catch (error) {
      console.error(`❌ Failed to merge translations for ${currentTheme}/${lang}:`, error);
    }
  }
};

// Global flag to prevent multiple plugin executions across all Vite instances
const getLockFilePath = (rootDir: string, theme: string) => 
  path.resolve(rootDir, `../../translations/.merge-lock-${theme}`);

// Vite plugin factory
export const createMergeTranslationsPlugin = (theme: string, rootDir: string) => {
  return {
    name: 'merge-translations',
    configResolved() {
      // Run only once per build process using a lock file approach
      const lockFile = getLockFilePath(rootDir, theme);
      
      if (!fs.existsSync(lockFile)) {
        // Create lock file
        fs.writeFileSync(lockFile, Date.now().toString());
        
        // Perform merge
        mergeTranslationsForTheme(theme, rootDir);
        
        // Clean up lock file when process exits
        process.on('exit', () => {
          if (fs.existsSync(lockFile)) {
            fs.unlinkSync(lockFile);
          }
        });
      }
    }
  };
}; 
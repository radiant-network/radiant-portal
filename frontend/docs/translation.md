# Translation System

This document describes the translation system used in the Radiant Portal project.

## Overview

The translation system uses i18next to manage translations across the application. It supports multiple languages and portals, with a layered approach to translation management.

## Directory Structure

```
translations/
├── common/                 # Shared translations across all portals
│   ├── en.json           # English translations
│   └── fr.json           # French translations
└── portals/              # Portal-specific translations
    ├── radiant/         # Radiant portal translations
    │   ├── en.json
    │   └── fr.json
    └── kf/              # KF portal translations
        ├── en.json
        └── fr.json
```

## Translation Strategy

### 1. Layered Approach

The system uses a layered approach to translations:

1. **Common Layer**: Base translations shared across all portals
   - Located in `translations/common/{lang}.json`
   - Contains generic UI elements, common actions, and shared terminology
   - Serves as the fallback for missing translations

2. **Portal Layer**: Portal-specific translations
   - Located in `translations/portals/{portal}/{lang}.json`
   - Overrides common translations
   - Contains portal-specific branding, terminology, and custom content
   - Selected based on the `THEME` environment variable

### 2. Loading Process

1. System loads common translations first
2. Then loads portal-specific translations based on `THEME`
3. Portal translations override common translations
4. If a portal translation is missing, falls back to common translation

## Usage

### 1. Basic Usage

```typescript
import { useI18n } from '@components/hooks/i18n';

const MyComponent = () => {
  const { t } = useI18n();
  
  return <h1>{t('welcome')}</h1>;
};
```

### 2. With Namespaces

```typescript
const { t } = useI18n('common');
return <h1>{t('common.welcome')}</h1>;
```

### 3. Language Switching

```typescript
const { setLanguage, currentLanguage } = useI18n();

// Switch to French
setLanguage('fr');
```

### 4. Using the Language Switcher Component

```typescript
import { LanguageSwitcher } from "@/components/base/language-switcher";

const Header = () => {
  return (
    <header>
      <LanguageSwitcher className="ml-auto" />
    </header>
  );
};
```

## Translation File Structure

### Common Translations (translations/common/en.json)
```json
{
  "welcome": "Welcome",
  "loading": "Loading...",
  "error": "Error",
  "success": "Success",
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  }
}
```

### Portal Translations (translations/portals/radiant/en.json)
```json
{
  "welcome": "Welcome to Radiant",
  "brand": {
    "name": "Radiant",
    "tagline": "Empowering Healthcare"
  },
  "actions": {
    "save": "Save Changes"
  }
}
```

## Best Practices

1. **Key Naming**
   - Use dot notation for nested keys
   - Keep keys short but descriptive
   - Use consistent naming patterns
   - Use `snake_case` when nesting can be overkill
```json
{
	"field": {
		"name": "Your Name",
		"name_tooltip": "Write your name right here"
	}
}
```
   - Use `snake_case` to match api's variable
```json
{
	"field": {
		"field_from_api": "Your Name",
	}
}
```

2. **Organization**
   - Group related translations under common keys
   - Use namespaces for different contexts
   - Keep portal-specific translations minimal

3. **Maintenance**
   - Document new translation keys
   - Keep translations up to date across all languages
   - Review and clean up unused translations

4. **Testing**
   - Test translations in all supported languages
   - Verify fallback behavior
   - Check for missing translations

## Environment Configuration

The translation system uses the following environment variables:

- `THEME`: Determines which portal translations to load (e.g., 'radiant', 'kf')
- `NODE_ENV`: Controls debug mode for translations

## Adding New Translations

1. Add new keys to the appropriate JSON files in the common directory
2. Add portal-specific overrides if needed
3. Document any new keys in the README
4. Test the translations in all supported languages

## Troubleshooting

1. **Missing Translations**
   - Check if the key exists in common translations
   - Verify portal-specific overrides are correct
   - Check for typos in translation keys

2. **Incorrect Language**
   - Verify the language is supported
   - Check language detection settings
   - Ensure language files exist

3. **Portal-Specific Issues**
   - Verify THEME environment variable is set
   - Check portal translation file exists
   - Review portal-specific overrides 
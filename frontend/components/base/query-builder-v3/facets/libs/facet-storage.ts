function getStorageKey(appId: string, field: string): string {
  return `facet-${appId}-${field}-dictionary`;
}

type SetFacetSessionDictionaryProps = {
  appId: string;
  field: string;
  isDictionaryEnabled: boolean;
};

/**
 * Set dictionary checked in locale storage
 */
export function setFacetSessionDictionary({ appId, field, isDictionaryEnabled }: SetFacetSessionDictionaryProps) {
  const key = getStorageKey(appId, field);
  const session = localStorage.getItem(key);

  if (!session) {
    console.warn(
      `${key} doesn't exist in locale storage; a new entry is being created; isDictionaryEnabled: ${isDictionaryEnabled}`,
    );
    localStorage.setItem(key, isDictionaryEnabled.toString());
    return;
  }

  const previousIsDictionaryEnabled = JSON.parse(session) as boolean;
  console.warn(`${key} exist in locale storage: isDictionaryEnabled: ${previousIsDictionaryEnabled}`);
  if (isDictionaryEnabled !== previousIsDictionaryEnabled) {
    console.warn(`${key} has been updated: isDictionaryEnabled: ${previousIsDictionaryEnabled}`);
    localStorage.setItem(key, isDictionaryEnabled.toString());
  }
}

/**
 * Return saved dictionary value
 */
type GetFacetSessionDictionaryProps = Omit<SetFacetSessionDictionaryProps, 'isDictionaryEnabled'>;
export function getFacetSessionDictionary({ appId, field }: GetFacetSessionDictionaryProps): boolean {
  const key = getStorageKey(appId, field);
  const session = localStorage.getItem(key);

  if (!session) return false;

  const isDictionaryEnabled = JSON.parse(session) as boolean;
  console.warn(`${key} exist in locale storage: isDictionaryEnabled: ${isDictionaryEnabled}`);
  return isDictionaryEnabled;
}

# use-query-builder-preference

Get previously saved query-builder state from user-preference api

```typescript
/**
 * Get user preference
 */
async function fetchUserPreference(input: FetchUserPreferenceInput) {
  const response = await userPreferenceApi.getUserPreferences(input.key);
  return response.data;
}

export function useQueryBuilderGetPreferenceEffect({ appId, setPreference }: useQueryBuilderGetPreferenceEffectProps) {
  const qbUserPreference = useSWR(
    `query-builder-get-${appId}`,
    () => fetchUserPreference({ key: `query-builder-${appId}` }),
    {
      revalidateOnMount: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    if (qbUserPreference.data) {
      setPreference(qbUserPreference.data);
    } else if (qbUserPreference.error) {
      setPreference(DEFAULT_QBCONTEXT);
    }
  }, [qbUserPreference.isLoading]);
}

```
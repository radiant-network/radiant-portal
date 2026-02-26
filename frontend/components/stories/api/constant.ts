export const BASE_URL = getBaseUrl();

function getBaseUrl() {
  if (location.hostname === 'radiant-network.github.io') {
    return 'radiant-network.github.io/radiant-portal/storybook/';
  }
  return import.meta.env.BASE_URL;
}

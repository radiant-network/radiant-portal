import { PortalConfig } from "@/components/model/applications-config";

export const config: PortalConfig = {
  admin: {
    app_id: 'admin',
    admin_code: 'admin',
  },
  variant_entity: {
    app_id: 'variant_entity',
  },
  variant_exploration: {
    app_id: 'variant_exploration_shared',
    aggregations: {
      variant: {
        items: [],
      },
    },
  },
  portal: {
    name: '',
    navigation: {
      dashboard: undefined,
      variant: undefined,
      profile: undefined,
      settings: undefined,
      logout: undefined
    }
  }
};
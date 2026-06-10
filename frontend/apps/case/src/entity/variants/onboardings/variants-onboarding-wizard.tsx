import { type Step } from 'react-joyride';

import OnboardingWizard from '@/components/base/onboarding/onboarding-wizard';
import { useI18n } from '@/components/hooks/i18n';

function VariantsOnboardingWizard() {
  const { t } = useI18n();
  const steps: Step[] = [
    {
      target: '#sequencing-experiment-seq-id',
      content: t('onboarding.sequencing_experiment.seq_id'),
      skipBeacon: true,
      closeButtonAction: 'skip',
      before: () => new Promise(resolve => setTimeout(resolve, 500)),
    },
    {
      target: '#sequencing-experiment-variant-type',
      content: t('onboarding.sequencing_experiment.variant_type'),
      closeButtonAction: 'skip',
      skipBeacon: true,
    },
    {
      target: '#sequencing-experiment-tasks',
      content: t('onboarding.sequencing_experiment.tasks'),
      closeButtonAction: 'skip',
      skipBeacon: true,
    },
    {
      target: '#sidebar-facets',
      content: t('onboarding.query_builder.facets'),
      placement: 'right',
      closeButtonAction: 'skip',
      skipBeacon: true,
      before: () => {
        document.getElementById('sidebar-group-toggle-sidebar')?.click();
        return new Promise(resolve => setTimeout(resolve, 300));
      },
      after: () => {
        document.getElementById('sidebar-group-toggle-sidebar')?.click();
        return new Promise(resolve => setTimeout(resolve, 300));
      },
    },
    {
      target: '#query-builder-card',
      content: t('onboarding.query_builder.query_card'),
      closeButtonAction: 'skip',
      skipBeacon: true,
    },
    {
      target: '#query-saved-filters',
      content: t('onboarding.query_builder.saved_filters'),
      closeButtonAction: 'skip',
      skipBeacon: true,
    },
    {
      target: '#data-table-column-settings',
      content: t('onboarding.data_table.column_settings'),
      closeButtonAction: 'skip',
      skipBeacon: true,
    },
    {
      target: '#data-table-column-settings-dropdown',
      content: t('onboarding.data_table.column_settings_dropdown'),
      closeButtonAction: 'skip',
      skipBeacon: true,
      placement: 'left',
      before: async () => {
        const trigger = document.getElementById('data-table-column-settings');
        trigger?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
        trigger?.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }));
        await new Promise(r => setTimeout(r, 50));
      },
      after: () => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      },
    },
    {
      target: '#data-table-fullscreen',
      content: t('onboarding.data_table.fullscreen'),
      closeButtonAction: 'skip',
      skipBeacon: true,
    },
    {
      target: '#data-table-occurrence-interpretation-note-flag',
      content: t('onboarding.data_table.interpretation_note_flag'),
      closeButtonAction: 'skip',
      skipBeacon: true,
    },
    {
      target: '.data-table-occurrence-hgvsg',
      content: t('onboarding.data_table.hgvsg'),
      closeButtonAction: 'skip',
      skipBeacon: true,
    },
  ];

  return <OnboardingWizard steps={steps} />;
}
export default VariantsOnboardingWizard;

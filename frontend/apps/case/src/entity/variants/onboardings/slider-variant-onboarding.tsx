import { type Step } from 'react-joyride';

import OnboardingWizard from '@/components/base/onboarding/onboarding-wizard';
import { useI18n } from '@/components/hooks/i18n';

function SliderVariantsOnboardingWizard() {
  const { t } = useI18n();
  const steps: Step[] = [
    {
      target: '#slider-header',
      content: t('onboarding.occurrence_slider.header'),
      skipBeacon: true,
      before: async () => new Promise(resolve => setTimeout(resolve, 150)),
    },
    {
      target: '#slider-header-navigation',
      content: t('onboarding.occurrence_slider.navigation'),
      skipBeacon: true,
    },
    {
      target: '#slider-note-flag',
      content: t('onboarding.occurrence_slider.note_flag'),
      skipBeacon: true,
    },
  ];

  return <OnboardingWizard steps={steps} />;
}
export default SliderVariantsOnboardingWizard;

import { useEffect } from 'react';
import { Joyride, type Step } from 'react-joyride';

import { useBetaFeatures } from '@/components/hooks/beta-feature-provider';
import { useI18n } from '@/components/hooks/i18n';

import OnboardingTooltip from './onboarding-tooltip';

type OnboardingWizard = {
  steps: Step[];
};
function OnboardingWizard({ steps }: OnboardingWizard) {
  const { t } = useI18n();
  const { features } = useBetaFeatures();

  /**
   * Workaround to prevent Radix modal layer (e.g. DropdownMenu, Dialog)
   * to overlap with joyride layer.
   */
  useEffect(() => {
    if (!features.onboarding) return;
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .react-joyride__floater,
      .react-joyride__floater * {
        pointer-events: auto !important;
      }
    `;
    document.head.appendChild(styleEl);
    return () => {
      styleEl.remove();
    };
  }, [features.onboarding]);

  if (!features.onboarding) return null;

  return (
    <Joyride
      run
      steps={steps}
      continuous
      tooltipComponent={OnboardingTooltip}
      floatingOptions={{ hideArrow: true }}
      options={{ buttons: ['back', 'skip', 'primary'], showProgress: true }}
      locale={{
        back: t('onboarding.actions.back'),
        skip: t('onboarding.actions.skip'),
        next: t('onboarding.actions.next'),
        last: t('onboarding.actions.last'),
        nextWithProgress: t('onboarding.actions.next_with_progress'),
      }}
    />
  );
}
export default OnboardingWizard;

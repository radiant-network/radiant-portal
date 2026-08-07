import { CLASSIFICATION_CHART_DATA, PATIENT_SUMMARY, VARIANTS_TABLE } from './mocks/case-1024';
import { type AssistantEngine, wait } from './engine';

/**
 * P4 mock: recognizes a few intents around the demo case 1024 and returns
 * the matching typed blocks (text + table, text + chart, or text). This stands
 * in for a real model call with tool-calling; the UI is unaware it is mocked.
 */
export const mockEngine: AssistantEngine = {
  async reply(userText) {
    await wait(700);
    const question = userText.toLowerCase();

    // Checked before the variant rule: "break down variants by classification"
    // also contains "variants", and this intent is the more specific one.
    if (/classification|breakdown|distribution|chart|acmg/.test(question)) {
      return [
        { type: 'text', content: 'Here is the ACMG classification breakdown for case 1024:' },
        {
          type: 'chart',
          title: 'Variants by ACMG classification',
          categoryLabel: 'Classification',
          valueLabel: 'Variants',
          data: CLASSIFICATION_CHART_DATA,
        },
      ];
    }

    if (/variant|pathogenic|mutation/.test(question)) {
      return [
        { type: 'text', content: 'I found 4 prioritized variants for case 1024 — 2 are classified pathogenic.' },
        VARIANTS_TABLE,
      ];
    }

    if (/patient|clinical|phenotype|profile|who/.test(question)) {
      return [{ type: 'text', content: PATIENT_SUMMARY }];
    }

    return [
      {
        type: 'text',
        content:
          'I can explore case 1024. Try: “Show the pathogenic variants”, “Break down variants by ACMG classification”, or “Describe the patient”.',
      },
    ];
  },
};

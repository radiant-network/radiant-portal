import { HttpResponse } from 'msw';

export const interpretationsGermlineApi = `api/interpretations/v2/germline/:case_id/:seq_id/:locus_id/:transcript_id`;

export async function httpInterpretationGermlineOccurrenceResponse() {
  return HttpResponse.json({
    id: '2cae8ebf-e480-4a3f-a6fc-5ba4864192e9',
    case_id: '1',
    sequencing_id: '1',
    locus_id: '219406',
    transcript_id: 'ENST00000412585',
    interpretation:
      '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus hendrerit, erat ut pulvinar semper, metus ligula elementum felis, tincidunt facilisis nibh neque tincidunt libero.</p>',
    metadata: {},
    created_by: '1468ac8a-b61f-4216-a1a1-a0db15150ac8',
    created_by_name: 'John Doe',
    created_at: '2026-01-26T16:50:17.382399Z',
    updated_by: '1468ac8a-b61f-4216-a1a1-a0db15150ac8',
    updated_by_name: 'John Doe',
    updated_at: '2026-01-26T16:50:17.382399Z',
    condition: 'MONDO:0000468',
    condition_name: 'third-degree atrioventricular block',
    classification: 'LA26334-5',
    classification_criterias: ['PVS1'],
    transmission_modes: ['unknown_father_genotype'],
  });
}

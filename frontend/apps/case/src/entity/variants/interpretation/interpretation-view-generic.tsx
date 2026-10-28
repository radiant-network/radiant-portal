import type { InterpretationPubmed } from '@/api/api';
import RichTextViewer from '@/components/base/data-entry/rich-text-editor/rich-text-viewer';
import EmptyField from '@/components/base/information/empty-field';
import { useI18n } from '@/components/hooks/i18n';

import InterpretationViewField from './interpretation-view-field';

type InterpretationViewGenericProps = {
  interpretation?: string;
  pubmed?: InterpretationPubmed[];
};

function InterpretationViewGeneric({ interpretation, pubmed = [] }: InterpretationViewGenericProps) {
  const { t } = useI18n();

  return (
    <>
      <InterpretationViewField label={t('variant.interpretation_form.generic.interpretation')}>
        {interpretation ? <RichTextViewer value={interpretation} wrapperClassName="bg-transparent" /> : <EmptyField />}
      </InterpretationViewField>
      <InterpretationViewField label={t('variant.interpretation_form.generic.pub_med_publication')}>
        {pubmed.length > 0 ? (
          <ul className="space-y-1">
            {pubmed.map(publication => (
              <li key={publication.citation_id}>{publication.citation}</li>
            ))}
          </ul>
        ) : (
          <EmptyField />
        )}
      </InterpretationViewField>
    </>
  );
}

export default InterpretationViewGeneric;

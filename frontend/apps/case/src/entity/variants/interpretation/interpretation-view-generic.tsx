import { useState } from 'react';
import { LibraryBig } from 'lucide-react';

import RichTextViewer from '@/components/base/data-entry/rich-text-editor/rich-text-viewer';
import EmptyField from '@/components/base/information/empty-field';
import PubmedListDialog from '@/components/base/pubmed/pubmed-list-dialog';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

import InterpretationViewField from './interpretation-view-field';
import type { Interpretation } from './types';

type InterpretationViewGenericProps = {
  interpretation?: Interpretation;
};

function InterpretationViewGeneric({ interpretation }: InterpretationViewGenericProps) {
  const { t } = useI18n();
  const [isPubmedOpen, setIsPubmedOpen] = useState(false);
  const pubmeds = interpretation?.pubmed ?? [];

  return (
    <>
      <InterpretationViewField
        label={t('variant.interpretation_form.generic.interpretation')}
        matchControlHeight={false}
      >
        <RichTextViewer
          className="min-h-9"
          wrapperClassName="bg-transparent w-full"
          value={interpretation?.interpretation ?? ''}
        />
      </InterpretationViewField>
      <InterpretationViewField label={t('variant.interpretation_form.generic.pub_med_publication')}>
        {pubmeds.length > 0 ? (
          <>
            <Button variant="link" className="p-0" onClick={() => setIsPubmedOpen(true)}>
              <LibraryBig />
              {t('preview_sheet.interpretation_details.fields.references', { count: pubmeds.length })}
            </Button>
            <PubmedListDialog pubmeds={pubmeds} open={isPubmedOpen} onClose={() => setIsPubmedOpen(false)} />
          </>
        ) : (
          <EmptyField />
        )}
      </InterpretationViewField>
    </>
  );
}

export default InterpretationViewGeneric;

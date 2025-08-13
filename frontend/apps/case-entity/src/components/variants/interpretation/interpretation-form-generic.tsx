import { useFormContext } from 'react-hook-form';

import RichTextEditor from '@/components/base/data-entry/rich-text-editor/rich-text-editor';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/base/ui/form';
import { useI18n } from '@/components/hooks/i18n';

import PubmedFormField from './pubmed-form-field';
import { genericInterpretationFormSchema, GenericInterpretationSchemaType } from './types';

function InterpretationFormGeneric() {
  const { t } = useI18n();
  const form = useFormContext<GenericInterpretationSchemaType>();

  return (
    <>
      <FormField
        control={form.control}
        name="interpretation"
        schema={genericInterpretationFormSchema}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('variant.interpretation_form.generic.interpretation')}</FormLabel>
            <FormControl>
              <RichTextEditor {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <PubmedFormField />
    </>
  );
}

export default InterpretationFormGeneric;

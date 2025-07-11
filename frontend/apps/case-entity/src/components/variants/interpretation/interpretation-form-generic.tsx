import { FormControl, FormField, FormItem, FormLabel } from '@/components/base/ui/form';
import RichTextEditor from '@/components/base/data-entry/rich-text-editor/rich-text-editor';
import { useFormContext } from 'react-hook-form';
import { genericInterpretationFormSchema, GenericInterpretationSchemaType } from './types';
import PubmedFormField from './pubmed-form-field';
import { useI18n } from '@/components/hooks/i18n';

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
            <FormLabel>{t('variant.interpretationForm.generic.interpretation')}</FormLabel>
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

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/base/ui/form';
import RichTextEditor from '@/components/base/data-entry/rich-text-editor/rich-text-editor';
import { useFormContext } from 'react-hook-form';
import { GenericInterpretationSchemaType } from './types';
import PubmedFormField from './pubmed-form-field';

function InterpretationFormGeneric() {
  const form = useFormContext<GenericInterpretationSchemaType>();

  return (
    <>
      <FormField
        control={form.control}
        name="interpretation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Interpretation</FormLabel>
            <FormControl>
              <RichTextEditor {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <PubmedFormField />
    </>
  );
}

export default InterpretationFormGeneric;

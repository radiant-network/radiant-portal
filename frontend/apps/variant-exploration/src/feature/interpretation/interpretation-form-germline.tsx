import { FormControl, FormField, FormItem, FormLabel } from '@/components/base/ui/form';
import MultipleSelector from '@/components/base/data-entry/multi-selector/multi-selector';
import { classificationCriterias, getClassificationCriteriaColor, getTransmissionModes } from './data';
import { FormProvider, useForm } from 'react-hook-form';
import { ToggleGroup, ToggleGroupItem } from '@/components/base/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import {
  germlineInterpretationFormSchema,
  GermlineInterpretationSchemaType,
  InterpretationFormProps,
  InterpretationFormRef,
} from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import InterpretationFormGeneric from './interpretation-form-generic';
import { Badge } from '@/components/base/ui/badge';
import MondoAutoCompleteFormField from './mondo-auto-complete-form-field';
import { InterpretationGermline, InterpretationPubmed } from '@/api/api';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useI18n } from '@/components/hooks/i18n';

function InterpretationFormGermline(
  { interpretation, saveInterpretation, onDirtyChange }: InterpretationFormProps<InterpretationGermline>,
  ref: React.Ref<InterpretationFormRef>,
) {
  const { t } = useI18n();
  const form = useForm<GermlineInterpretationSchemaType>({
    resolver: zodResolver(germlineInterpretationFormSchema),
    values: {
      classification: interpretation?.classification || '',
      classification_criterias: interpretation?.classification_criterias || [],
      condition: interpretation?.condition || '',
      transmission_modes: interpretation?.transmission_modes || [],
      interpretation: interpretation?.interpretation || '',
      pubmed: (interpretation?.pubmed || []) as Required<InterpretationPubmed>[],
    },
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  function onSubmit(values: GermlineInterpretationSchemaType) {
    saveInterpretation(values);
  }

  useEffect(() => {
    onDirtyChange(form.formState.isDirty);
  }, [form.formState.isDirty]);

  useImperativeHandle(
    ref,
    () => ({
      submit: () => form.handleSubmit(onSubmit)(),
      isDirty: form.formState.isDirty,
    }),
    [form, onSubmit, form.formState.isDirty],
  );

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <MondoAutoCompleteFormField
          name="condition"
          label={t('variant.interpretationForm.germline.condition')}
          placeholder={t('variant.interpretationForm.germline.condition-placeholder')}
        />
        <FormField
          control={form.control}
          name="classification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('variant.interpretationForm.germline.classification')}</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  size="default"
                  variant="outline"
                  className="flex-wrap justify-start"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <ToggleGroupItem
                    value="LA6668-3"
                    className=" data-[state=on]:bg-red-100 data-[state=on]:text-red-800 border data-[state=on]:border-red-200"
                  >
                    {t('variant.interpretationForm.germline.classification-options.pathogenic')}
                  </ToggleGroupItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <ToggleGroupItem
                          value="LA26332-9"
                          className=" data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-800 border data-[state=on]:border-yellow-300"
                        >
                          {t('variant.interpretationForm.germline.classification-options.likelyPathogenic')}
                        </ToggleGroupItem>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('variant.interpretationForm.germline.classification-options.likelyPathogenic-tooltip')}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <ToggleGroupItem
                          value="LA26333-7"
                          className=" data-[state=on]:bg-orange-100 data-[state=on]:text-orange-900 border data-[state=on]:border-orange-300"
                        >
                          {t('variant.interpretationForm.germline.classification-options.vus')}
                        </ToggleGroupItem>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('variant.interpretationForm.germline.classification-options.vus-tooltip')}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <ToggleGroupItem
                          value="LA26334-5"
                          className=" data-[state=on]:bg-lime-100 data-[state=on]:text-lime-900 border data-[state=on]:border-lime-300"
                        >
                          {t('variant.interpretationForm.germline.classification-options.likelyBenign')}
                        </ToggleGroupItem>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('variant.interpretationForm.germline.classification-options.likelyBenign-tooltip')}
                    </TooltipContent>
                  </Tooltip>
                  <ToggleGroupItem
                    value="LA6675-8"
                    className=" data-[state=on]:bg-green-100 data-[state=on]:text-green-800 border data-[state=on]:border-green-300"
                  >
                    {t('variant.interpretationForm.germline.classification-options.benign')}
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="classification_criterias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('variant.interpretationForm.germline.classificationCriteria')}</FormLabel>
              <FormControl>
                <MultipleSelector
                  defaultOptions={classificationCriterias}
                  placeholder={t('variant.interpretationForm.germline.classificationCriteria-placeholder')}
                  emptyIndicator={<>no results found.</>}
                  renderBadge={({ option, onRemove }) => {
                    const tagColor = getClassificationCriteriaColor(option.value);

                    return (
                      <Badge
                        key={option.value}
                        data-fixed={option.fixed}
                        onClose={onRemove}
                        //style={{
                        //  color: `hsl(var(--${tagColor}-9))`,
                        //  backgroundColor: `hsl(var(--${tagColor}-3))`,
                        //}}
                        //closeIconProps={{
                        //  style: { color: `hsl(var(--${tagColor}-9))` },
                        //}}
                      >
                        {option.label}
                      </Badge>
                    );
                  }}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transmission_modes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('variant.interpretationForm.germline.modeOfTransmission')}</FormLabel>
              <FormControl>
                <MultipleSelector
                  defaultOptions={getTransmissionModes(t)}
                  placeholder={t('variant.interpretationForm.germline.modeOfTransmission-placeholder')}
                  emptyIndicator={<p>no results found.</p>}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <InterpretationFormGeneric />
      </div>
    </FormProvider>
  );
}

export default forwardRef<InterpretationFormRef, InterpretationFormProps<InterpretationGermline>>(
  InterpretationFormGermline,
);

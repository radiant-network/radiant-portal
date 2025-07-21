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
import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useI18n } from '@/components/hooks/i18n';
import AnchorLink from '@/components/base/navigation/anchor-link';

const InterpretationFormGermline = forwardRef<InterpretationFormRef, InterpretationFormProps<InterpretationGermline>>(
  ({ interpretation, saveInterpretation, onDirtyChange }, ref) => {
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
            schema={germlineInterpretationFormSchema}
            control={form.control}
            name="classification"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  infoCardContent={
                    <div className="leading-6">
                      {t('variant.interpretationForm.germline.classification_popover.consult')}{' '}
                      <AnchorLink
                        className="inline-flex"
                        href="https://pubmed.ncbi.nlm.nih.gov/25741868/"
                        target="_blank"
                        size="sm"
                        external
                      >
                        {t('variant.interpretationForm.germline.classification_popover.standards_and_guidelines')}
                      </AnchorLink>{' '}
                      {t('variant.interpretationForm.germline.classification_popover.variant_interpretation')}
                    </div>
                  }
                >
                  {t('variant.interpretationForm.germline.classification')}
                </FormLabel>
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
                      className="data-[state=on]:bg-red/20 data-[state=on]:text-red-foreground border data-[state=on]:border-red-foreground data-[state=on]:hover:text-red-foreground"
                    >
                      {t('variant.interpretation.classifications.pathogenic')}
                    </ToggleGroupItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <ToggleGroupItem
                            value="LA26332-9"
                            className="data-[state=on]:bg-orange/20 data-[state=on]:text-orange-foreground border data-[state=on]:border-orange-foreground data-[state=on]:hover:text-orange-foreground"
                          >
                            {t('variant.interpretation.classifications.likelyPathogenic')}
                          </ToggleGroupItem>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t('variant.interpretation.classifications.likelyPathogenic-tooltip')}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <ToggleGroupItem
                            value="LA26333-7"
                            className="data-[state=on]:bg-yellow/20 data-[state=on]:text-yellow-foreground border data-[state=on]:border-yellow-foreground data-[state=on]:hover:text-yellow-foreground"
                          >
                            {t('variant.interpretation.classifications.vus')}
                          </ToggleGroupItem>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{t('variant.interpretation.classifications.vus-tooltip')}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <ToggleGroupItem
                            value="LA26334-5"
                            className="data-[state=on]:bg-lime/20 data-[state=on]:text-lime-foreground border data-[state=on]:border-lime-foreground data-[state=on]:hover:text-lime-foreground"
                          >
                            {t('variant.interpretation.classifications.likelyBenign')}
                          </ToggleGroupItem>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t('variant.interpretation.classifications.likelyBenign-tooltip')}
                      </TooltipContent>
                    </Tooltip>
                    <ToggleGroupItem
                      value="LA6675-8"
                      className="data-[state=on]:bg-green/20 data-[state=on]:text-green-foreground border data-[state=on]:border-green-foreground data-[state=on]:hover:text-green-foreground"
                    >
                      {t('variant.interpretation.classifications.benign')}
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            schema={germlineInterpretationFormSchema}
            name="classification_criterias"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('variant.interpretationForm.germline.classificationCriteria')}</FormLabel>
                <FormControl>
                  <MultipleSelector
                    defaultOptions={classificationCriterias}
                    placeholder={t('variant.interpretationForm.germline.classificationCriteria-placeholder')}
                    emptyIndicator={<>no results found.</>}
                    renderBadge={({ option, onRemove }) => (
                      <Badge
                        key={option.value}
                        data-fixed={option.fixed}
                        onClose={onRemove}
                        variant={getClassificationCriteriaColor(option.value)}
                      >
                        {option.label}
                      </Badge>
                    )}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            schema={germlineInterpretationFormSchema}
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
  },
);

InterpretationFormGermline.displayName = 'InterpretationFormGermline';

export default InterpretationFormGermline;

import { FormProvider, useForm } from 'react-hook-form';
import MondoAutoCompleteFormField from './mondo-auto-complete-form-field';
import {
  InterpretationFormProps,
  InterpretationFormRef,
  somaticInterpretationFormSchema,
  SomaticInterpretationSchemaType,
} from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/base/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/base/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import {
  getClinicalUtilitys,
  getOncogenicityClassificationCriteriaColor,
  oncogenicityClassificationCriterias,
} from './data';
import MultipleSelector from '@/components/base/data-entry/multi-selector/multi-selector';
import { Badge } from '@/components/base/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import InterpretationFormGeneric from './interpretation-form-generic';
import { InterpretationSomatic } from '@/api/api';
import { forwardRef, useImperativeHandle } from 'react';
import { useI18n } from '@/components/hooks/i18n';

function InterpretationFormSomatic(
  { interpretation, saveInterpretation }: InterpretationFormProps<InterpretationSomatic>,
  ref: React.Ref<InterpretationFormRef>,
) {
  const { t } = useI18n();
  const form = useForm<SomaticInterpretationSchemaType>({
    resolver: zodResolver(somaticInterpretationFormSchema),
    defaultValues: {
      tumoral_type: interpretation?.tumoral_type,
      oncogenicity: interpretation?.oncogenicity,
      oncogenicity_classification_criterias: interpretation?.oncogenicity_classification_criterias,
      clinical_utility: interpretation?.clinical_utility,
      interpretation: interpretation?.interpretation,
      pubmed: interpretation?.pubmed,
    },
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  function onSubmit(values: SomaticInterpretationSchemaType) {
    saveInterpretation(values);
  }

  useImperativeHandle(
    ref,
    () => ({
      submit: () => form.handleSubmit(onSubmit)(),
      isDirty: form.formState.isDirty,
    }),
    [ref, form, onSubmit],
  );

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <MondoAutoCompleteFormField
          name="tumoral_type"
          label={t('variant.interpretationForm.somatic.tumoralType')}
          placeholder={t('variant.interpretationForm.somatic.tumoralType-placeholder')}
        />
        <FormField
          control={form.control}
          name="oncogenicity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span>
                  {t('variant.interpretationForm.somatic.oncogenicity')} (
                  <a
                    href="https://pubmed.ncbi.nlm.nih.gov/35101336/"
                    target="_blank"
                    className="text-primary underline hover:no-underline outline-none"
                    rel="noreferrer"
                  >
                    PMID: 35101336
                  </a>
                  )
                </span>
              </FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  size="default"
                  variant="outline"
                  className="flex-wrap justify-start"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <ToggleGroupItem
                    value="LA6668-3"
                    className=" data-[state=on]:bg-red-100 data-[state=on]:text-red-800 border data-[state=on]:border-red-200"
                  >
                    {t('variant.interpretationForm.somatic.oncogenicity-options.oncogenic')}
                  </ToggleGroupItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <ToggleGroupItem
                          value="LA26332-9"
                          className="data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-800 border data-[state=on]:border-yellow-300"
                        >
                          {t('variant.interpretationForm.somatic.oncogenicity-options.likelyOncogenic')}
                        </ToggleGroupItem>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('variant.interpretationForm.somatic.oncogenicity-options.likelyOncogenic-tooltip')}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <ToggleGroupItem
                          value="LA26333-7"
                          className=" data-[state=on]:bg-orange-100 data-[state=on]:text-orange-900 border data-[state=on]:border-orange-300"
                        >
                          {t('variant.interpretationForm.somatic.oncogenicity-options.vus')}
                        </ToggleGroupItem>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('variant.interpretationForm.somatic.oncogenicity-options.vus-tooltip')}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <ToggleGroupItem
                          value="LA26334-5"
                          className=" data-[state=on]:bg-lime-100 data-[state=on]:text-lime-900 border data-[state=on]:border-lime-300"
                        >
                          {t('variant.interpretationForm.somatic.oncogenicity-options.likelyBenign')}
                        </ToggleGroupItem>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('variant.interpretationForm.somatic.oncogenicity-options.likelyBenign-tooltip')}
                    </TooltipContent>
                  </Tooltip>
                  <ToggleGroupItem
                    value="LA6675-8"
                    className=" data-[state=on]:bg-green-100 data-[state=on]:text-green-800 border data-[state=on]:border-green-300"
                  >
                    {t('variant.interpretationForm.somatic.oncogenicity-options.benign')}
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="oncogenicity_classification_criterias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('variant.interpretationForm.somatic.classificationCriteria')}</FormLabel>
              <FormControl>
                <MultipleSelector
                  defaultOptions={oncogenicityClassificationCriterias}
                  placeholder={t('variant.interpretationForm.somatic.classificationCriteria-placeholder')}
                  emptyIndicator={<>no results found.</>}
                  renderBadge={({ option, onRemove }) => {
                    const tagColor = getOncogenicityClassificationCriteriaColor(option.value);

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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clinical_utility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('variant.interpretationForm.somatic.clinicalUtility')}</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('variant.interpretationForm.somatic.clinicalUtility-placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getClinicalUtilitys(t).map(clinicalUtility => (
                      <SelectItem key={clinicalUtility.value} value={clinicalUtility.value}>
                        {clinicalUtility.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <InterpretationFormGeneric />
      </div>
    </FormProvider>
  );
}

export default forwardRef<InterpretationFormRef, InterpretationFormProps<InterpretationSomatic>>(
  InterpretationFormSomatic,
);

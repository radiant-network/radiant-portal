import { FormProvider, useForm } from 'react-hook-form';
import MondoAutoCompleteFormField from './mondo-auto-complete-form-field';
import { somaticInterpretationFormSchema, SomaticInterpretationSchemaType } from './types';
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

function InterpretationFormSomatic() {
  const form = useForm<SomaticInterpretationSchemaType>({
    resolver: zodResolver(somaticInterpretationFormSchema),
    defaultValues: {},
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  function onSubmit(values: SomaticInterpretationSchemaType) {
    // Save interpretation
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <MondoAutoCompleteFormField name="tumoral_type" label="Tumor type" placeholder="Select" />
        <FormField
          control={form.control}
          name="oncogenicity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span>
                  Oncogenicity ClinGen/CGC/VICC (
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
                    className="bg-white hover:bg-white data-[state=on]:bg-red-100 data-[state=on]:text-red-800 border data-[state=on]:border-red-200"
                  >
                    Oncogenic
                  </ToggleGroupItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <ToggleGroupItem
                          value="LA26332-9"
                          className="bg-white hover:bg-white data-[state=on]:bg-volcano-100 data-[state=on]:text-volcano-800 border data-[state=on]:border-volcano-300"
                        >
                          Likely Oncogenic
                        </ToggleGroupItem>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Probably oncogenic</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <ToggleGroupItem
                          value="LA26333-7"
                          className="bg-white hover:bg-white data-[state=on]:bg-orange-100 data-[state=on]:text-orange-900 border data-[state=on]:border-orange-300"
                        >
                          VUS
                        </ToggleGroupItem>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Variant of Uncertain Significance</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <ToggleGroupItem
                          value="LA26334-5"
                          className="bg-white hover:bg-white data-[state=on]:bg-lime-100 data-[state=on]:text-lime-900 border data-[state=on]:border-lime-300"
                        >
                          Likely Benign
                        </ToggleGroupItem>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Probably benign</TooltipContent>
                  </Tooltip>
                  <ToggleGroupItem
                    value="LA6675-8"
                    className="bg-white hover:bg-white data-[state=on]:bg-green-100 data-[state=on]:text-green-800 border data-[state=on]:border-green-300"
                  >
                    Benign
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
              <FormLabel>Classification criteria e.g. PM1, PS2</FormLabel>
              <FormControl>
                <MultipleSelector
                  defaultOptions={oncogenicityClassificationCriterias}
                  placeholder="Classification criteria"
                  emptyIndicator={<>no results found.</>}
                  renderBadge={({ option, onRemove }) => {
                    const tagColor = getOncogenicityClassificationCriteriaColor(option.value);

                    return (
                      <Badge
                        key={option.value}
                        variant="default"
                        data-fixed={option.fixed}
                        onClose={onRemove}
                        style={{
                          color: `hsl(var(--${tagColor}-9))`,
                          backgroundColor: `hsl(var(--${tagColor}-3))`,
                        }}
                        closeIconProps={{
                          style: { color: `hsl(var(--${tagColor}-9))` },
                        }}
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
              <FormLabel>Clinical utility</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getClinicalUtilitys().map(clinicalUtility => (
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
      </form>
    </FormProvider>
  );
}

export default InterpretationFormSomatic;

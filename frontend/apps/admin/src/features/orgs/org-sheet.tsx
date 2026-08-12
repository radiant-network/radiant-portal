import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/base/shadcn/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/base/shadcn/form';
import { Input } from '@/components/base/shadcn/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/base/shadcn/sheet';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import { ORG_CATEGORIES } from '../../mock/data';
import type { Organization } from '../../mock/types';

import type { OrgFormValues } from './org-form.types';
import { orgFormSchema } from './org-sheet-schema';

type OrgSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present = Edit mode; absent/null = Add mode. */
  org?: Organization | null;
  /** All tenant orgs — for the duplicate-code check on create. */
  orgs: Organization[];
  onSave: (values: OrgFormValues, orgCode?: string) => void;
};

function toFormValues(org?: Organization | null): OrgFormValues {
  return {
    code: org?.code ?? '',
    name: org?.name ?? '',
    category_code: org?.category_code ?? '',
  };
}

/**
 * Fold accented letters onto the `[a-z0-9_]` code charset and lowercase them, so French input
 * normalizes as the user types (Éléphant → elephant, Cœur → coeur). NFD splits an accented
 * character into base + combining mark, which we strip; the œ/æ ligatures don't decompose, so
 * they're expanded explicitly. ES2020-safe.
 */
function toCodeChars(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritics left by NFD (é→e, ç→c)
    .replace(/œ/gi, 'oe')
    .replace(/æ/gi, 'ae')
    .toLowerCase();
}

/**
 * Suggest a code slug from the name: fold accents + lowercase, non-alphanumerics → underscore,
 * collapsed, forced to start with a letter, and capped at 50 (backend rule `[a-z][a-z0-9_]*`,
 * max 50). Only a starting point — the user can edit it. Uses `.replace(/…/g)` (not
 * `String.replaceAll`) to stay ES2020-safe.
 */
function slugifyCode(name: string): string {
  return toCodeChars(name)
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^[^a-z]+/, '')
    .replace(/_+$/, '')
    .slice(0, 50);
}

export default function OrgSheet({ open, onOpenChange, org, orgs, onSave }: OrgSheetProps) {
  const { t } = useI18n();
  const isEdit = !!org;

  const form = useForm<OrgFormValues>({
    resolver: zodResolver(orgFormSchema),
    values: toFormValues(org),
  });

  // On Add, auto-fill the code from the name until the user edits the code themselves; then leave
  // it alone. Reset the "touched" flag whenever the sheet (re)opens.
  const [codeTouched, setCodeTouched] = useState(false);
  useEffect(() => {
    if (open) setCodeTouched(isEdit);
  }, [open, isEdit]);

  const name = form.watch('name');
  useEffect(() => {
    if (!isEdit && !codeTouched) {
      form.setValue('code', slugifyCode(name), { shouldValidate: false });
    }
  }, [name, codeTouched, isEdit, form]);

  const currentCategoryLabel = org ? t(`admin.org_categories.${org.category_code}`) : '';

  // Read isDirty during render so RHF's formState Proxy actually tracks it; accessed only inside the
  // submit handler it stays stale (false), which wrongly short-circuits every edit as a no-op.
  const { isDirty } = form.formState;

  const onValid = (values: OrgFormValues) => {
    if (isEdit) {
      // Edit is name-only; an unchanged edit is a no-op that just closes (no save, no toast).
      if (!isDirty) {
        onOpenChange(false);
        return;
      }
      onSave(values, org!.code);
      onOpenChange(false);
      return;
    }
    // Create: enforce a unique code within the tenant (backend returns 409 on the (code, tenant) PK).
    const isDuplicate = orgs.some(o => o.code.toLowerCase() === values.code.toLowerCase());
    if (isDuplicate) {
      form.setError('code', { message: 'code_duplicate' }, { shouldFocus: true });
      return;
    }
    onSave(values);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:w-[480px] sm:max-w-[480px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onValid)} className="flex h-full flex-col overflow-hidden">
            <SheetHeader className="space-y-1.5 border-b px-6 py-4">
              <SheetTitle className="text-lg">
                {isEdit ? t('admin.org.edit_title') : t('admin.org.add_title')}
              </SheetTitle>
              {/* Visible one-liner orienting the admin: orgs are the scope roles are assigned at. */}
              <SheetDescription>{t('admin.org.description')}</SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
              <FormField
                control={form.control}
                name="name"
                schema={orgFormSchema}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t('admin.org.name')}</FormLabel>
                    <FormControl>
                      <Input {...field} className={cn(fieldState.error && 'border-destructive')} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {isEdit ? (
                // Code is immutable after creation → read-only. Uppercased for display like the table.
                <div className="flex flex-col gap-2.5">
                  <FormLabel className="text-foreground">{t('admin.org.code')}</FormLabel>
                  <Input value={org!.code} readOnly disabled className="uppercase" />
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="code"
                  schema={orgFormSchema}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{t('admin.org.code')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          // Normalize to the code charset as the user types: fold accents +
                          // lowercase (Éléphant → elephant). Invalid chars (spaces, hyphens) are
                          // left for validation to flag, matching the prior lowercase-only behavior.
                          onChange={e => {
                            setCodeTouched(true);
                            field.onChange(toCodeChars(e.target.value));
                          }}
                          className={cn('uppercase', fieldState.error && 'border-destructive')}
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">{t('admin.org.code_hint')}</p>
                    </FormItem>
                  )}
                />
              )}

              {isEdit ? (
                // Category is immutable after creation → read-only display.
                <div className="flex flex-col gap-2.5">
                  <FormLabel className="text-foreground">{t('admin.org.category')}</FormLabel>
                  <Input value={currentCategoryLabel} readOnly disabled />
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="category_code"
                  schema={orgFormSchema}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{t('admin.org.category')}</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className={cn(fieldState.error && 'border-destructive')}>
                            <SelectValue placeholder={t('admin.org.category_placeholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ORG_CATEGORIES.map(c => (
                            <SelectItem key={c.code} value={c.code}>
                              {t(`admin.org_categories.${c.code}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">{t('admin.org.category_hint')}</p>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <SheetFooter className="flex-row items-center justify-end border-t p-6">
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {t('admin.org.cancel')}
                </Button>
                <Button type="submit">{isEdit ? t('admin.org.save') : t('admin.org.create')}</Button>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

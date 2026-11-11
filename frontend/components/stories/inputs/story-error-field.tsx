import type { ReactNode } from 'react';

import { Field, FieldError, FieldLabel } from '@/components/base/shadcn/field';

interface StoryErrorFieldProps {
  label: ReactNode;
  invalid?: boolean;
  required?: boolean;
  error?: ReactNode;
  width?: number;
  layout?: 'stacked' | 'inline';
  children: ReactNode;
}

/**
 * Shows a control in its error state, the way the `Form*` layer renders it in the
 * app: red label, red message, and — for controls that have a border — a red
 * border coming from the control's own `aria-invalid` styling.
 *
 * Pass `aria-invalid={invalid}` on the control yourself. Leave it out for checkbox,
 * radio and switch, which by design show the label and the message only.
 *
 * The red label is the one hardcoded class here, and it mirrors what `FormLabel`
 * applies on error. Everything else must come from the components, so that a
 * story cannot show an error state the app is unable to produce.
 */
export function StoryErrorField({
  label,
  invalid = true,
  required = true,
  error = 'This field is required',
  width = 300,
  layout = 'stacked',
  children,
}: StoryErrorFieldProps) {
  const labelElement = (
    <FieldLabel className={invalid ? 'gap-1 text-destructive' : 'gap-1'}>
      {label}
      {required && <span className="text-destructive">*</span>}
    </FieldLabel>
  );

  return (
    <div style={{ width }}>
      <Field>
        {layout === 'stacked' ? (
          <>
            {labelElement}
            {children}
          </>
        ) : (
          <div className="flex items-center gap-2">
            {children}
            {labelElement}
          </div>
        )}
        {invalid && <FieldError>{error}</FieldError>}
      </Field>
    </div>
  );
}

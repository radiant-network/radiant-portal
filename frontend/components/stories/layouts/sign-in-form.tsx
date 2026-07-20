import { HTMLAttributes } from 'react';

import { Button } from '@/components/base/shadcn/button';
import { Input } from '@/components/base/shadcn/input';
import { Label } from '@/components/base/shadcn/label';
import { cn } from '@/components/lib/utils';

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="#0A66C2"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.82-.07-1.6-.21-2.36H12v4.46h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.72z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.09A12 12 0 0 0 12 24z"
      />
      <path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.28a12 12 0 0 0 0 10.76l4.01-3.09z" />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.28 6.62l4.01 3.09C6.23 6.86 8.88 4.75 12 4.75z"
      />
    </svg>
  );
}

/**
 * Static, non-functional sign-in form used to illustrate layout stories.
 * Shared across layout stories (split, and the upcoming second layout).
 */
function SignInForm({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('w-full max-w-sm space-y-6', className)} {...props}>
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold text-foreground">Sign in to your account</h1>
        <p className="text-sm text-muted-foreground">Choose a sign-in method</p>
      </div>

      <div className="space-y-2">
        <Button variant="outline" className="w-full">
          <LinkedInIcon />
          Sign in with LinkedIn
        </Button>
        <Button variant="outline" className="w-full">
          <GoogleIcon />
          Sign in with Google
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="whitespace-nowrap text-xs text-muted-foreground">Or sign in with email</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <span className="text-sm text-muted-foreground">Forgot your password?</span>
          </div>
          <Input id="password" type="password" />
        </div>
        <Button className="w-full">Sign in</Button>
      </div>
    </div>
  );
}

export default SignInForm;

'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'
import { IconBrandGithub } from '@tabler/icons-react'
import { AlertTriangle, Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInWithGitHub } from '../actions'
import { signUpAction } from './actions'

export function FormSignUp() {
  const router = useRouter()

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signUpAction,
    () => {
      router.push('/auth/sign-in')
    }
  )

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign in failed!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input type="text" name="name" id="name" />
          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input type="email" name="email" id="email" />
          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" id="password" />
          {errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirm your password</Label>
          <Input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
          />
          {errors?.password_confirmation && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password_confirmation[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            'Create account'
          )}
        </Button>

        <Button variant="link" className="w-full" size="sm" asChild>
          <Link href="/auth/sign-in">Already registered? Sign in</Link>
        </Button>
      </form>

      <Separator />

      <form action={signInWithGitHub}>
        <Button type="submit" variant="outline" className="w-full">
          <IconBrandGithub className="size-4 ml-2 " />
          Sign up with GitHub
        </Button>
      </form>
    </div>
  )
}

'use server'

import { acceptInvite } from '@/http/accept-invite'
import { signInWithPassword } from '@/http/sign-in-with-password'
import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email({
    message: 'Please, provide a valid e-mail address.',
  }),
  password: z.string().min(1, {
    message: 'Please, provide a password.',
  }),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInWithPassword({
      email: email,
      password: password,
    })

    const cookiesStore = await cookies()

    const SEVEN_DAYS = 60 * 60 * 24 * 7

    cookiesStore.set('token', token, {
      maxAge: SEVEN_DAYS,
      path: '/',
    })

    const inviteId = cookiesStore.get('inviteId')?.value

    if (inviteId) {
      try {
        await acceptInvite({ inviteId })
        cookiesStore.delete('inviteId')
      } catch (error) {}
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.error(error)

    return {
      success: false,
      message: 'An unexpected error occurred. Please, try again later.',
      errors: null,
    }
  }

  return {
    success: true,
    message: null,
    errors: null,
  }
}

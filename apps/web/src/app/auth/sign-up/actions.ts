'use server'

import { signUp } from '@/http/sign-up'
import { HTTPError } from 'ky'
import { z } from 'zod'

const signUpSchema = z
  .object({
    name: z.string().refine(value => value.split(' ').length > 1, {
      message: 'Please, provide your full name.',
    }),
    email: z.string().email({
      message: 'Please, provide a valid e-mail address.',
    }),
    password: z.string().min(6, {
      message: 'Password must have at least 6 characters.',
    }),
    password_confirmation: z.string(),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: 'Passwords do not match.',
    path: ['password_confirmation'],
  })

export async function signUpAction(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, password, name } = result.data

  try {
    await signUp({
      name: name,
      email: email,
      password: password,
    })
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

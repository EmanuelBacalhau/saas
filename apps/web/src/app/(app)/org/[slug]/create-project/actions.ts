'use server'

import { getCurrentOrg } from '@/auth/auth'
import { createProject } from '@/http/create-project'
import { HTTPError } from 'ky'
import { z } from 'zod'

const projectSchema = z.object({
  name: z.string().min(4, {
    message: 'Project name should have at least 4 characters.',
  }),
  description: z.string().nonempty({
    message: 'Description is required.',
  }),
})

export async function createProjectAction(data: FormData) {
  const result = projectSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, description } = result.data
  const org = await getCurrentOrg()
  try {
    await createProject({
      name,
      description,
      org: org as string,
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
    message: 'Successfully!',
    errors: null,
  }
}

import z from 'zod'

type StatusCode = 200 | 201 | 204 | 400 | 401 | 500

type Params = {
  code: StatusCode
  schema?: z.ZodObject<z.ZodRawShape> | z.ZodNull
}

interface ErrorSchema {
  [key: number]: z.ZodObject<z.ZodRawShape> | z.ZodNull
}

export function responseSwaggerSchema(params: Params[]) {
  const defaultErrorSchema: ErrorSchema = {
    200: z.null().describe('Success'),
    201: z.null().describe('Successfully'),
    204: z.null().describe('No Content'),
    400: z
      .object({
        message: z.string(),
        errors: z
          .object({
            path: z.string(),
            message: z.string(),
          })
          .array(),
      })
      .describe('Bad Request'),
    401: z
      .object({
        message: z.string(),
      })
      .describe('Unauthorized'),
    500: z
      .object({
        message: z.string(),
      })
      .describe('Internal Server Error'),
  }

  const errorSchema: ErrorSchema = {}

  for (const { code, schema } of params) {
    if (schema) {
      errorSchema[code] = schema
    } else if (defaultErrorSchema[code]) {
      errorSchema[code] = defaultErrorSchema[code]
    } else {
      throw new Error(`Schema não definido para o status code ${code}.`)
    }
  }

  return errorSchema
}

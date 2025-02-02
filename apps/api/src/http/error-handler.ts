import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { BadRequestError } from './routes/_errors/bad-request-error'
import { UnauthorizedError } from './routes/_errors/unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error.validation) {
    const errorDetails = error.validation.map(err => ({
      path: err.instancePath.replace('/', ''),
      message: err.message,
    }))

    return reply.status(400).send({
      message: 'Validation error',
      errors: errorDetails,
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  // send error to some observability platform

  return reply.status(500).send({
    message: 'Internal server error',
  })
}

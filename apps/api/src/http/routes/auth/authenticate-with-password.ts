import { prisma } from '@/lib/prisma'
import { responseSwaggerSchema } from '@/lib/response-swagger-schema'
import { compare } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with e-mail & password',
        body: z.object({
          email: z.string().email(),
          password: z.string().nonempty(),
        }),
        response: responseSwaggerSchema([
          {
            code: 200,
            schema: z.object({
              token: z.string(),
            }),
          },
          {
            code: 400,
          },
          {
            code: 401,
          },
          {
            code: 500,
          },
        ]),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!userFromEmail) {
        throw new UnauthorizedError('Invalid e-mail or password')
      }

      if (userFromEmail.passwordHash == null) {
        throw new UnauthorizedError(
          'User does not have a password, use social login'
        )
      }

      const isValidPassword = await compare(
        password,
        userFromEmail.passwordHash
      )

      if (!isValidPassword) {
        throw new UnauthorizedError('Invalid e-mail or password')
      }

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        }
      )

      return reply.status(200).send({
        token,
      })
    }
  )
}

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { responseSwaggerSchema } from '@/lib/response-swagger-schema'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function resetPassword(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/password/reset',
      {
        schema: {
          tags: ['auth'],
          summary: 'Reset password',
          body: z.object({
            code: z.string().nonempty(),
            password: z.string().min(6),
          }),
          response: responseSwaggerSchema([
            {
              code: 204,
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
        const { code, password } = request.body

        const tokenFromCode = await prisma.token.findUnique({
          where: {
            id: code,
          },
        })

        if (!tokenFromCode) {
          throw new UnauthorizedError()
        }

        const passwordHash = await hash(password, 6)

        await prisma.$transaction([
          prisma.user.update({
            where: {
              id: tokenFromCode.userId,
            },
            data: {
              passwordHash,
            },
          }),

          prisma.token.delete({
            where: {
              id: code,
            },
          }),
        ])

        return reply.status(204).send()
      }
    )
}

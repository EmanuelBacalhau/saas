import { prisma } from '@/lib/prisma'
import { responseSwaggerSchema } from '@/lib/response-swagger-schema'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequest } from '../_errors/bad-request'

export async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      schema: {
        tags: ['auth'],
        summary: 'Get authenticated user profile',
        response: responseSwaggerSchema([
          {
            code: 200,
            schema: z.object({
              user: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
                avatarUrl: z.string().nullable(),
              }),
            }),
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
      const { sub } = await request.jwtVerify<{ sub: string }>()

      const user = await prisma.user.findUnique({
        where: {
          id: sub,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      })

      if (!user) {
        throw new BadRequest('User not found')
      }

      return reply.send({
        user,
      })
    }
  )
}

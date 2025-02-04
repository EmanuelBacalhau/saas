import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { responseSwaggerSchema } from '@/lib/response-swagger-schema'
import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/invites/:inviteId',
      {
        schema: {
          tags: ['invites'],
          summary: 'Get an invite',
          params: z.object({
            inviteId: z.string().uuid(),
          }),
          response: responseSwaggerSchema([
            {
              code: 200,
              schema: z.object({
                invite: z.object({
                  id: z.string(),
                  email: z.string(),
                  role: roleSchema,
                  createdAt: z.date(),
                  organization: z.object({
                    name: z.string(),
                  }),
                  author: z
                    .object({
                      id: z.string(),
                      name: z.string().nullable(),
                      avatarUrl: z.string().nullable(),
                    })
                    .nullable(),
                }),
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
        const { inviteId } = request.params

        const invite = await prisma.invite.findFirst({
          where: {
            id: inviteId,
          },
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            organization: {
              select: {
                name: true,
              },
            },
          },
        })

        if (!invite) {
          throw new BadRequestError('Invite not found')
        }

        return reply.code(200).send({
          invite,
        })
      }
    )
}

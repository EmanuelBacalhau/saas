import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { responseSwaggerSchema } from '@/lib/response-swagger-schema'
import { getUserPermission } from '@/utils/get-user-permission'
import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/members',
      {
        schema: {
          tags: ['members'],
          summary: 'Get all organizations members',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string().nonempty(),
          }),
          response: responseSwaggerSchema([
            {
              code: 200,
              schema: z.object({
                members: z
                  .object({
                    id: z.string(),
                    userId: z.string(),
                    email: z.string(),
                    name: z.string().nullable(),
                    avatarUrl: z.string().nullable(),
                    role: roleSchema,
                  })
                  .array(),
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
        const userId = await request.getCurrentUserId()
        const { slug } = request.params

        const { membership, organization } =
          await request.getUserMembership(slug)

        const ability = getUserPermission(userId, membership.role)

        if (ability.cannot('get', 'User')) {
          throw new BadRequestError(
            `You're not allowed to see organization members`
          )
        }

        const members = await prisma.member.findMany({
          where: {
            organizationId: organization.id,
          },
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            role: 'asc',
          },
        })

        const membersWithRoles = members.map(
          ({ user: { id: userId, ...user }, ...member }) => ({
            ...member,
            ...user,
            userId,
          })
        )

        return reply.code(200).send({
          members: membersWithRoles,
        })
      }
    )
}

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { responseSwaggerSchema } from '@/lib/response-swagger-schema'
import { getUserPermission } from '@/utils/get-user-permission'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function revokeInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/invites/:inviteId',
      {
        schema: {
          tags: ['invites'],
          summary: 'Create a new invite',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string().nonempty(),
            inviteId: z.string().uuid(),
          }),
          response: responseSwaggerSchema([
            {
              code: 204,
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
        const { slug, inviteId } = request.params

        const { membership, organization } =
          await request.getUserMembership(slug)

        const ability = getUserPermission(userId, membership.role)

        if (ability.cannot('delete', 'Invite')) {
          throw new BadRequestError('You do not allowed to delete an invite')
        }

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
            organizationId: organization.id,
          },
        })

        if (!invite) {
          throw new BadRequestError('Invite not found')
        }

        await prisma.invite.delete({
          where: {
            id: invite.id,
            organizationId: organization.id,
          },
        })

        return reply.code(204).send()
      }
    )
}

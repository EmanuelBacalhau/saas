import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { responseSwaggerSchema } from '@/lib/response-swagger-schema'
import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { tuple, z } from 'zod'

// id: string
// name: string
// slug: string
// domain: string | null
// shouldAttachUsersByDomain: boolean
// avatarUrl: string | null
// createdAt: Date
// updatedAt: Date
// ownerId: string

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Get organizations',
          security: [{ bearerAuth: [] }],
          response: responseSwaggerSchema([
            {
              code: 200,
              schema: z.object({
                organizations: z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    slug: z.string(),
                    avatarUrl: z.string().nullable(),
                    role: roleSchema,
                  })
                  .array(),
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
        const userId = await request.getCurrentUserId()

        const organizations = await prisma.organization.findMany({
          where: {
            members: {
              some: {
                userId,
              },
            },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            members: {
              select: {
                role: true,
              },
              where: {
                userId,
              },
            },
          },
        })

        const organizationsWithRole = organizations.map(
          ({ members, ...org }) => {
            return {
              ...org,
              role: members[0].role,
            }
          }
        )

        return reply.send({
          organizations: organizationsWithRole,
        })
      }
    )
}

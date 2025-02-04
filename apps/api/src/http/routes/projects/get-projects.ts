import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { responseSwaggerSchema } from '@/lib/response-swagger-schema'
import { getUserPermission } from '@/utils/get-user-permission'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getProjects(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['projects'],
          summary: 'Get all organizations projects',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string().nonempty(),
          }),
          response: responseSwaggerSchema([
            {
              code: 200,
              schema: z.object({
                projects: z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    description: z.string(),
                    slug: z.string(),
                    ownerId: z.string(),
                    organizationId: z.string(),
                    avatarUrl: z.string().nullable(),
                    createdAt: z.date(),
                    owner: z.object({
                      id: z.string(),
                      name: z.string().nullable(),
                      avatarUrl: z.string().nullable(),
                    }),
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

        if (ability.cannot('get', 'Project')) {
          throw new BadRequestError(
            `You're not allowed to see organizations projects`
          )
        }

        const projects = await prisma.project.findMany({
          where: {
            organizationId: organization.id,
          },
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
            createdAt: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return reply.code(200).send({
          projects,
        })
      }
    )
}

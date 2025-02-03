import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { responseSwaggerSchema } from '@/lib/response-swagger-schema'
import { createSlug } from '@/utils/create-slug'
import { getUserPermission } from '@/utils/get-user-permission'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function createProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['projects'],
          summary: 'Create a new project',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string().nonempty(),
            description: z.string().nonempty(),
          }),
          params: z.object({
            slug: z.string().nonempty(),
          }),
          response: responseSwaggerSchema([
            {
              code: 201,
              schema: z.object({
                projectId: z.string().uuid(),
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

        if (ability.cannot('create', 'Project')) {
          throw new BadRequestError('You do not allowed to create a project')
        }

        const { name, description } = request.body

        const project = await prisma.project.create({
          data: {
            name,
            description,
            slug: createSlug(name),
            organizationId: organization.id,
            ownerId: userId,
          },
        })

        return reply.code(201).send({
          projectId: project.id,
        })
      }
    )
}

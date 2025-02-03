import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { responseSwaggerSchema } from '@/lib/response-swagger-schema'
import { getUserPermission } from '@/utils/get-user-permission'
import { projectSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function deleteProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/projects/:projectId',
      {
        schema: {
          tags: ['projects'],
          summary: 'Delete a project',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string().nonempty(),
            projectId: z.string().uuid(),
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
        const { slug, projectId } = request.params

        const { membership, organization } =
          await request.getUserMembership(slug)

        const project = await prisma.project.findUnique({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
        })

        if (!project) {
          throw new BadRequestError('Project not found')
        }

        const authProject = projectSchema.parse({
          id: project.id,
          ownerId: project.ownerId,
        })

        const ability = getUserPermission(userId, membership.role)

        if (ability.cannot('delete', authProject)) {
          throw new BadRequestError('You do not allowed to delete this project')
        }

        await prisma.project.delete({
          where: {
            id: projectId,
          },
        })

        return reply.code(204).send()
      }
    )
}

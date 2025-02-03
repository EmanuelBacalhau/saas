import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { responseSwaggerSchema } from '@/lib/response-swagger-schema'
import { createSlug } from '@/utils/create-slug'
import { getUserPermission } from '@/utils/get-user-permission'
import { defineAbilityFor, organizationSchema, userSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Update a new organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string().nonempty(),
          }),
          body: z.object({
            name: z.string().optional(),
            domain: z.string().nullish().optional(),
            shouldAttachUsersByDomain: z.boolean().optional(),
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
        const { slug } = request.params
        const { name, domain, shouldAttachUsersByDomain } = request.body

        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const authOrganization = organizationSchema.parse({
          id: organization.id,
          ownerId: organization.ownerId,
        })

        const ability = getUserPermission(userId, membership.role)

        if (ability.cannot('update', authOrganization)) {
          throw new UnauthorizedError(
            `You're not allowed to update this organization`
          )
        }

        if (domain) {
          const organizationWithSameDomain =
            await prisma.organization.findFirst({
              where: {
                domain,
                slug: {
                  not: slug,
                },
              },
            })

          if (organizationWithSameDomain) {
            throw new BadRequestError(
              'Organization with this domain already exists'
            )
          }
        }

        await prisma.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            name,
            domain,
            shouldAttachUsersByDomain,
          },
        })

        return reply.code(204).send()
      }
    )
}

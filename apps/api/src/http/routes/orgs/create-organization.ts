import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { responseSwaggerSchema } from '@/lib/response-swagger-schema'
import { createSlug } from '@/utils/create-slug'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Create an new organization',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string().nonempty(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: responseSwaggerSchema([
            {
              code: 201,
              schema: z.object({
                organizationId: z.string().uuid(),
              }),
            },
            {
              code: 400,
            },
          ]),
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { name, domain, shouldAttachUsersByDomain } = request.body

        if (domain) {
          const organizationWithSameDomain =
            await prisma.organization.findUnique({
              where: { domain },
            })

          if (organizationWithSameDomain) {
            throw new BadRequestError(
              'Organization with this domain already exists'
            )
          }
        }

        const organization = await prisma.organization.create({
          data: {
            name,
            slug: createSlug(name),
            domain,
            shouldAttachUsersByDomain,
            ownerId: userId,
            members: {
              create: {
                userId,
                role: 'ADMIN',
              },
            },
          },
        })

        reply.code(201).send({
          organizationId: organization.id,
        })
      }
    )
}

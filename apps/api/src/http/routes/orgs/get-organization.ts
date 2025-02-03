import { auth } from '@/http/middlewares/auth'
import { responseSwaggerSchema } from '@/lib/response-swagger-schema'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function getOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Get details from organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string().nonempty(),
          }),
          response: responseSwaggerSchema([
            {
              code: 200,
              schema: z.object({
                organization: z.object({
                  id: z.string(),
                  name: z.string(),
                  slug: z.string(),
                  domain: z.string().nullable(),
                  shouldAttachUsersByDomain: z.boolean(),
                  avatarUrl: z.string().nullable(),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                  ownerId: z.string(),
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
        const { slug } = request.params
        const { organization } = await request.getUserMembership(slug)

        return reply.send({
          organization,
        })
      }
    )
}

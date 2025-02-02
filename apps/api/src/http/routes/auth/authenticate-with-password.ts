import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with e-mail & password',
        body: z.object({
          email: z.string().email(),
          password: z.string().nonempty(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!userFromEmail) {
        return reply.status(400).send({
          message: 'Invalid e-mail or password',
        })
      }

      if (userFromEmail.passwordHash == null) {
        return reply.status(400).send({
          message: 'User does not have a password, use social login',
        })
      }

      const isValidPassword = await compare(
        password,
        userFromEmail.passwordHash
      )

      if (!isValidPassword) {
        return reply.status(400).send({
          message: 'Invalid e-mail or password',
        })
      }

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        }
      )

      return reply.status(201).send({
        token,
      })
    }
  )
}

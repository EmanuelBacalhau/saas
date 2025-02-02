import { prisma } from '@/lib/prisma'
import { responseSwaggerSchema } from '@/lib/response-swagger-schema'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with Github',
        body: z.object({
          code: z.string().nonempty(),
        }),
        response: responseSwaggerSchema([
          {
            code: 200,
            schema: z.object({
              token: z.string(),
            }),
          },
          {
            code: 400,
          },
          {
            code: 500,
          },
        ]),
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const githubOauthURL = new URL(
        'https://github.com/login/oauth/access_token'
      )

      const CLIENT_ID = 'Ov23li94dlND3ax0h8oG'
      githubOauthURL.searchParams.set('client_id', CLIENT_ID)
      githubOauthURL.searchParams.set(
        'client_secret',
        '250581228f1b43d16d4aeee3aee42cecd95263eb'
      )
      githubOauthURL.searchParams.set(
        'redirect_uri',
        'http://localhost:3000/api/auth/callback'
      )
      githubOauthURL.searchParams.set('code', code)

      const githubAccessTokenResponse = await fetch(githubOauthURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      const githubAccessTokenData = await githubAccessTokenResponse.json()

      const { access_token } = z
        .object({
          access_token: z.string(),
          token_type: z.string(),
          scope: z.string(),
        })
        .parse(githubAccessTokenData)

      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })

      const githubUserData = await githubUserResponse.json()

      const {
        id: githubId,
        name,
        avatar_url: avatarUrl,
        email,
      } = z
        .object({
          id: z.number().int(),
          avatar_url: z.string().url(),
          name: z.string().nullable(),
          email: z.string().email().nullable(),
        })
        .parse(githubUserData)

      if (email === null) {
        throw new BadRequestError(
          'Your Github account must have an email to authenticate'
        )
      }

      let user = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            avatarUrl,
          },
        })
      }

      const account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GITHUB',
            userId: user.id,
          },
        },
      })

      if (!account) {
        await prisma.account.create({
          data: {
            provider: 'GITHUB',
            userId: user.id,
            providerAccountId: githubId.toString(),
          },
        })
      }

      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        }
      )

      return reply.status(200).send({
        token,
      })
    }
  )
}

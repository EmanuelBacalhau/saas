import { z } from 'zod'
import { envNextjs } from './env-wrapper'

export const env = envNextjs.createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string(),
    GITHUB_OAUTH_CLIENT_ID: z.string(),
    GITHUB_OAUTH_CLIENT_SECRET: z.string(),
    GITHUB_OAUTH_CLIENT_REDIRECT_URI: z.string().url(),
    PORT: z.coerce.number().default(3333),
  },
  client: {},
  shared: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID,
    GITHUB_OAUTH_CLIENT_SECRET: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    GITHUB_OAUTH_CLIENT_REDIRECT_URI:
      process.env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
    PORT: process.env.PORT,
  },
  emptyStringAsUndefined: true,
})

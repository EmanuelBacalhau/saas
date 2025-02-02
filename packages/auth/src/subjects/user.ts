import { z } from 'zod'

const userSubject = z.tuple([
  z.enum(['manage', 'get', 'update', 'delete']),
  z.literal('User'),
])

export type UserSubject = z.infer<typeof userSubject>

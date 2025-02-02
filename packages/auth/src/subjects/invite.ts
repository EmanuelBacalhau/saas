import { z } from 'zod'

const inviteSubject = z.tuple([
  z.enum(['manage', 'get', 'create', 'delete']),
  z.literal('Invite'),
])

export type InviteSubject = z.infer<typeof inviteSubject>

import type { Role } from '@saas/auth'
import { api } from './api-client'

interface RevokeInviteRequest {
  slug: string
  inviteId: string
}

export async function revokeInvite({ slug, inviteId }: RevokeInviteRequest) {
  await api.delete(`organizations/${slug}/invites/${inviteId}`)
}

import type { Role } from '@saas/auth'
import { api } from './api-client'

interface AcceptInviteRequest {
  inviteId: string
}

export async function acceptInvite({ inviteId }: AcceptInviteRequest) {
  await api.post(`invites/${inviteId}/accept`)
}

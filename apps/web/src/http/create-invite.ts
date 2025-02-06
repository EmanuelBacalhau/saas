import type { Role } from '@saas/auth'
import { api } from './api-client'

interface CreateInviteRequest {
  org: string
  email: string
  role: Role
}

export async function createInvite(data: CreateInviteRequest) {
  await api.post(`organizations/${data.org}/invites`, {
    json: {
      email: data.email,
      role: data.role,
    },
  })
}

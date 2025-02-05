import { api } from './api-client'

interface ShutDownOrganizationRequest {
  org: string
}

export async function shutDownOrganization({
  org,
}: ShutDownOrganizationRequest) {
  await api.delete(`organizations/${org}`)
}

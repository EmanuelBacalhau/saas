import { api } from './api-client'

interface UpdateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
  org: string
}

type UpdateOrganizationResponse = undefined

export async function updateOrganization(
  data: UpdateOrganizationRequest
): Promise<UpdateOrganizationResponse> {
  await api.put(`organizations/${data.org}`, {
    json: {
      name: data.name,
      domain: data.domain,
      shouldAttachUsersByDomain: data.shouldAttachUsersByDomain,
    },
  })
}

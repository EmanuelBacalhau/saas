import { api } from './api-client'

interface CreateProjectRequest {
  org: string
  name: string
  description: string
}

type CreateProjectResponse = undefined

export async function createProject(
  data: CreateProjectRequest
): Promise<CreateProjectResponse> {
  await api.post(`organizations/${data.org}/projects`, {
    json: {
      name: data.name,
      description: data.description,
    },
  })
}

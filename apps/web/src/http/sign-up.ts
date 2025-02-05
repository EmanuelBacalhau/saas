import { api } from './api-client'

interface SignUpRequest {
  name: string
  email: string
  password: string
}

type SignUpResponse = undefined

export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  await api.post('users', {
    json: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  })
}

import { api } from './api-client'

interface SignInWithPasswordRequest {
  email: string
  password: string
}

interface SignInWithPasswordResponse {
  token: string
}

export async function signInWithPassword(data: SignInWithPasswordRequest) {
  const result = await api
    .post('sessions/password', {
      json: {
        email: data.email,
        password: data.password,
      },
    })
    .json<SignInWithPasswordResponse>()

  return result
}

'use server'

import { redirect } from 'next/navigation'

export async function signInWithGitHub() {
  const githubSignInURL = new URL('login/oauth/authorize', 'https://github.com')

  githubSignInURL.searchParams.set('client_id', 'Ov23li94dlND3ax0h8oG')
  githubSignInURL.searchParams.set(
    'client_uri',
    'http://localhost:3000/api/auth/callback'
  )
  githubSignInURL.searchParams.set('scope', 'user')

  redirect(githubSignInURL.toString())
}

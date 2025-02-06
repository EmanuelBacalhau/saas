import { acceptInvite } from '@/http/accept-invite'
import { signInWithGitHub } from '@/http/sign-in-with-github'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      {
        message: 'GitHub OAuth code was not found',
      },
      {
        status: 400,
      }
    )
  }

  const { token } = await signInWithGitHub({ code })

  const cookiesStore = await cookies()

  const SEVEN_DAYS = 60 * 60 * 24 * 7

  cookiesStore.set('token', token, {
    maxAge: SEVEN_DAYS,
    path: '/',
  })

  const inviteId = cookiesStore.get('inviteId')?.value

  if (inviteId) {
    try {
      await acceptInvite({ inviteId })
      cookiesStore.delete('inviteId')
    } catch (error) {}
  }

  const redirectURL = request.nextUrl.clone()

  redirectURL.pathname = '/'
  redirectURL.search = ''

  return NextResponse.redirect(redirectURL)
}

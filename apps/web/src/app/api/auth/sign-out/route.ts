import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const cookiesStore = await cookies()

  const redirectURL = request.nextUrl.clone()

  redirectURL.pathname = '/auth/sign-in'

  cookiesStore.delete('token')

  return NextResponse.redirect(redirectURL)
}

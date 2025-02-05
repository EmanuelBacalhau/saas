import { isAuthenticated } from '@/auth/auth'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await isAuthenticated()

  if (!user) {
    redirect('/auth/sign-in')
  }

  return <>{children}</>
}

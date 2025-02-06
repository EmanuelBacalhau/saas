import { auth, isAuthenticated } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { acceptInvite } from '@/http/accept-invite'
import { getInvite } from '@/http/get-invite'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CheckCircleIcon, LogInIcon, LogOutIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

dayjs.extend(relativeTime)

interface InvitePageProps {
  params: {
    id: string
  }
}

export default async function InvitePage(props: InvitePageProps) {
  const { id } = props.params

  const { invite } = await getInvite({ inviteId: id })

  const isUserAuthenticated = await isAuthenticated()
  let currentUserEmail = null

  if (isUserAuthenticated) {
    const { user } = await auth()

    currentUserEmail = user.email
  }
  const userIsAuthenticatedWithSameEmailFromInvite =
    currentUserEmail === invite.email

  async function signInFromInvite() {
    'use server'
    const cookiesStore = await cookies()

    cookiesStore.set('inviteId', id)

    redirect(`/auth/sign-in?email=${invite.email}`)
  }

  async function acceptInviteAction() {
    'use server'
    await acceptInvite({ inviteId: id })

    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col px-4">
      <div className="w-full max-w-lg space-y-6 flex flex-col justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {invite.author?.avatarUrl && (
              <AvatarImage src={invite.author.avatarUrl} />
            )}
            <AvatarFallback />
          </Avatar>

          <p className="text-center leading-relaxed text-muted-foreground text-balance">
            <span className="font-medium text-foreground">
              {invite.author.name ?? 'Someone'}
            </span>{' '}
            invite you to join{' '}
            <span className="font-medium text-foreground">
              {invite.organization.name}.
            </span>{' '}
            <span className="text-xs">
              {dayjs(invite.createdAt).fromNow()}.
            </span>
          </p>
        </div>

        <Separator />

        {!isUserAuthenticated && (
          <form action={signInFromInvite}>
            <Button type="submit" variant="secondary" className="w-full">
              <LogInIcon className="size-2 mr-1" />
              Sign in to accept the invite
            </Button>
          </form>
        )}

        {userIsAuthenticatedWithSameEmailFromInvite && (
          <form action={acceptInviteAction}>
            <Button type="submit" variant="secondary" className="w-full">
              <CheckCircleIcon className="size-2 mr-1" />
              Join {invite.organization.name}
            </Button>
          </form>
        )}

        {isUserAuthenticated && !userIsAuthenticatedWithSameEmailFromInvite && (
          <div className="space-y-4">
            <p className="text-balance text-center text-sm leading-relaxed text-muted-foreground">
              This invite was sent to{' '}
              <span className="text-foreground font-medium">
                {invite.email}
              </span>{' '}
              but you are signed in as{' '}
              <span className="text-foreground font-medium">
                {currentUserEmail}
              </span>
              .
            </p>

            <div className="space-y-2">
              <Button className="w-full" variant={'secondary'} asChild>
                <Link href="/api/auth/sign-out">
                  <LogOutIcon className="size-2 mr-1" />
                  Sign out from {currentUserEmail}
                </Link>
              </Button>

              <Button className="w-full" variant={'outline'} asChild>
                <Link href="/">Back to dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

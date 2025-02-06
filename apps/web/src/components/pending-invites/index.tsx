'use client'

import { getPendingInvites } from '@/http/get-pendin-invites'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CheckIcon, UserPlus2Icon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { acceptInviteAction, rejectInviteAction } from './actions'
dayjs.extend(relativeTime)

export function PendingInvites() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
    enabled: isOpen,
  })

  async function handleAcceptInvite(inviteId: string) {
    await acceptInviteAction(inviteId)
    await queryClient.invalidateQueries({
      queryKey: ['pending-invites'],
    })
  }

  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId)
    await queryClient.invalidateQueries({
      queryKey: ['pending-invites'],
    })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <UserPlus2Icon />
          <span className="sr-only">Pending invites</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-2">
        <span className="text-sm font-medium block">
          Pending invites ({data?.invites.length ?? 0})
        </span>

        {data?.invites.length === 0 && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            No pending invites.
          </p>
        )}

        {data?.invites.map(invite => (
          <div className="space-y-2" key={invite.id}>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="text-foreground">
                {invite.author.name ?? 'Someone'}
              </span>{' '}
              invite you to join{' '}
              <span className="text-foreground">
                {invite.organization.name}.
              </span>{' '}
              <span>{dayjs(invite.createdAt).fromNow()}.</span>
            </p>

            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAcceptInvite(invite.id)}
              >
                <CheckIcon className="size-3" />
                Accept
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => handleRejectInvite(invite.id)}
              >
                <XIcon className="size-3" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}

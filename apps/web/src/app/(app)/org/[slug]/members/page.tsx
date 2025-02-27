import { ability } from '@/auth/auth'
import { Invites } from './invites'
import { MemberList } from './member-list'

export default async function Members() {
  const permission = await ability()

  const canGetInvites = permission?.can('get', 'Invite')
  const canGetUsers = permission?.can('get', 'User')

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Members</h1>
      <div className="space-y-4">
        {canGetInvites && <Invites />}
        {canGetUsers && <MemberList />}
      </div>
    </div>
  )
}

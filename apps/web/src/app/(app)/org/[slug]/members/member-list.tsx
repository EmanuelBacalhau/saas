import { ability, getCurrentMembership, getCurrentOrg } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getMembers } from '@/http/get-members'
import { getOrganization } from '@/http/get-organization'
import { organizationSchema } from '@saas/auth'
import { ArrowLeftRightIcon, CrownIcon, UserMinusIcon } from 'lucide-react'
import { removerMemberAction } from './actions'
import { UpdateMemberRoleSelect } from './udpate-member-role-select'

export async function MemberList() {
  const currentOrg = await getCurrentOrg()

  const [{ members }, membership, { organization }] = await Promise.all([
    getMembers({ slug: currentOrg as string }),
    getCurrentMembership(),
    getOrganization({ org: currentOrg as string }),
  ])

  const authOrganization = organizationSchema.parse(organization)

  const permissions = await ability()

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Members</h2>

      <div className="border rounded">
        <Table>
          <TableBody>
            {members.map(member => (
              <TableRow key={member.id}>
                <TableCell className="py-2.5" style={{ width: 48 }}>
                  <Avatar className="size-9">
                    {member.avatarUrl ? (
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                    ) : null}
                    <AvatarFallback />
                  </Avatar>
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="flex flex-col">
                    <span className="font-medium inline-flex items-center gap-2">
                      {member.name}
                      {member.userId === membership?.userId && ' (me)'}
                      {member.userId === organization.ownerId && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <CrownIcon className="size-3" /> Owner
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {member.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    {permissions?.can('transfer_ownership', authOrganization) &&
                      member.userId !== organization.ownerId && (
                        <Button size="sm" variant="ghost">
                          <ArrowLeftRightIcon className="size-4" />
                          Transfer ownership
                        </Button>
                      )}

                    {permissions?.can('update', 'User') &&
                      member.userId !== organization.ownerId && (
                        <UpdateMemberRoleSelect
                          memberId={member.id}
                          value={member.role}
                          disabled={
                            member.userId === membership?.userId ||
                            member.userId === organization.ownerId
                          }
                        />
                      )}

                    {permissions?.can('delete', 'User') && (
                      <form action={removerMemberAction.bind(null, member.id)}>
                        <Button
                          type="submit"
                          size="sm"
                          variant="destructive"
                          disabled={
                            member.userId === membership?.userId ||
                            member.userId === organization.ownerId
                          }
                        >
                          <UserMinusIcon className="size-4" />
                          Transfer ownership
                        </Button>
                      </form>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

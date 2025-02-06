import { ability, getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getInvites } from '@/http/get-invites'
import { XOctagonIcon } from 'lucide-react'
import { CreateInviteForm } from './craete-invite-form'
import { RevokeInviteButton } from './revoke-invite-button'

export async function Invites() {
  const currentOrg = await getCurrentOrg()
  const permission = await ability()

  const canCreateInvite = permission?.can('create', 'Invite')
  const canDeleteInvite = permission?.can('delete', 'Invite')

  const { invites } = await getInvites({ slug: currentOrg as string })

  return (
    <div className="space-y-4">
      {canCreateInvite && (
        <Card>
          <CardHeader>
            <CardTitle>Invite member</CardTitle>
            <CardDescription>
              Invite a new member to your organization
            </CardDescription>
          </CardHeader>

          <CardContent>
            <CreateInviteForm />
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Invites</h2>

        <div className="border rounded">
          <Table>
            <TableBody>
              {invites.map(invite => (
                <TableRow key={invite.id}>
                  <TableCell className="py-2.5">
                    <span className="text-muted-foreground font-medium">
                      {invite.email}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5">{invite.role}</TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex justify-end">
                      {canDeleteInvite && (
                        <RevokeInviteButton inviteId={invite.id} />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {invites.length === 0 && (
                <TableRow>
                  <TableCell className="text-center text-muted-foreground">
                    No invites found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

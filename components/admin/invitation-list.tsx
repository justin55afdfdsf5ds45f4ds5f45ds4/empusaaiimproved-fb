"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import type { Invitation } from "@/models/invitation"

export default function InvitationList() {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchInvitations = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/invitations")

      if (!response.ok) {
        throw new Error("Failed to fetch invitations")
      }

      const data = await response.json()
      setInvitations(data.invitations)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvitations()
  }, [])

  const deleteInvitation = async (token: string) => {
    if (!confirm("Are you sure you want to delete this invitation?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/invitations/${token}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete invitation")
      }

      // Remove from state
      setInvitations(invitations.filter((inv) => inv.token !== token))
    } catch (err: any) {
      setError(err.message || "An error occurred")
    }
  }

  const getStatusBadge = (invitation: Invitation) => {
    if (invitation.used) {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Used</span>
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Expired</span>
    }

    return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Active</span>
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Invitations</CardTitle>
          <CardDescription>Manage your invitation links</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchInvitations} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {invitations.length === 0 && !loading ? (
          <p className="text-center py-4 text-gray-500">No invitations found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.token}>
                    <TableCell>{invitation.email || "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(invitation)}</TableCell>
                    <TableCell>{format(new Date(invitation.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(invitation.expiresAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteInvitation(invitation.token)}
                        disabled={invitation.used}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

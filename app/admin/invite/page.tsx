import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import InvitationForm from "@/components/admin/invitation-form"
import InvitationList from "@/components/admin/invitation-list"

export default async function AdminInvitePage() {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/invite")
  }

  // In a real app, you'd check if the user has admin privileges
  // For now, we'll assume all authenticated users can access this page

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Invitation System</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <InvitationForm />
        </div>
        <div>
          <InvitationList />
        </div>
      </div>
    </div>
  )
}

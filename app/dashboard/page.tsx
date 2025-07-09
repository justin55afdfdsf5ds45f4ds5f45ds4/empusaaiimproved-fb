import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import DashboardWrapper from "./DashboardWrapper"

export default async function DashboardPage() {
  // const session = await getServerSession(authOptions)
  // if (!session) {
  //   redirect("/login")
  // }

  return <DashboardWrapper />
}

import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to Pinterest auth page
  redirect("/pinterest-auth")

  // This won't be rendered due to the redirect
  return null
}

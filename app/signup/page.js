"use client" // Required for Next.js 13+ App Router

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation" // Use this hook for search params
import { httpsCallable } from "firebase/functions"
import { doc, getDoc } from "firebase/firestore"
import { functions, db } from "../../lib/firebase" // Corrected import path from `app` dir

function SignUpContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [isValidToken, setIsValidToken] = useState(null)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValidToken(false)
        setMessage("No invitation token provided.")
        return
      }
      const invRef = doc(db, "invitations", token)
      const invDoc = await getDoc(invRef)
      if (invDoc.exists() && invDoc.data().status === "pending") {
        setIsValidToken(true)
        setEmail(invDoc.data().email)
      } else {
        setIsValidToken(false)
        setMessage("This invitation link is invalid or has expired.")
      }
    }
    verifyToken()
  }, [token])

  const handleSignUp = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    const createInvitedUser = httpsCallable(functions, "createInvitedUser")
    try {
      await createInvitedUser({ token, password })
      setMessage("Account created successfully! You can now log in.")
      // You might want to redirect here after a delay
    } catch (error) {
      setMessage(`Error: ${error.message}`)
      setIsLoading(false)
    }
  }

  if (isValidToken === null) return <div>Verifying invitation...</div>
  if (!isValidToken)
    return (
      <div>
        <h1>Error</h1>
        <p>{message}</p>
      </div>
    )

  return (
    <div>
      <h2>Create Your Account for {email}</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a password"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading signup page...</div>}>
      <SignUpContent />
    </Suspense>
  )
}

export default SignUpPage

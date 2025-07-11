// Example path: app/sign-up-public/page.js
// COPY-PASTE THIS ENTIRE FILE'S CONTENT

'use client'; // Required for Next.js App Router

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../../lib/firebase'; // Make sure this path is correct

function PublicSignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create user document in Firestore
      // This is the step that was missing before
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        isAdmin: false // Default to not being an admin
      });

      // 3. Redirect to a new page on success (e.g., dashboard or login)
      router.push('/dashboard'); // 💡 Change this to your desired page after signup

    } catch (err) {
      // Handle errors (e.g., email already in use)
      setError(err.message);
      console.error("Error signing up:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default PublicSignUpPage;

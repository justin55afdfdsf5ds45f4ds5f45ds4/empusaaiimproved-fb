// Example path: app/sign-up-public/page.js
// COPY-PASTE THIS ENTIRE FILE'S CONTENT

'use client'; // Required for Next.js App Router

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

function PublicSignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Call our Supabase-backed register route
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: email.split('@')[0], email, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }

      // Immediately sign the user in with credentials provider
      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (err: any) {
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

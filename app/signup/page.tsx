"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }
    // Create credits row for the user
    await supabase.from('credits').insert([{ user_id: data.user?.id, credits: 5 }]);
    setIsLoading(false);
    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="mb-2 w-full p-2 border rounded" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="mb-2 w-full p-2 border rounded" />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button type="submit" className="w-full bg-teal-600 text-white p-2 rounded" disabled={isLoading}>{isLoading ? "Signing up..." : "Sign Up"}</button>
      </form>
    </div>
  );
}

// src/app/signup/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signup', username, password, email }),
    });
    if (res.ok) {
      router.push(`/confirm?username=${encodeURIComponent(username)}`);
    } else {
      const { error } = await res.json();
      setMessage(error);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#232F3E] to-[#121417]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border-2 border-[#FF9900]">
        <Image src="/AWS_LOGO.png" alt="AWS Logo" width={48} height={48} className="mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-center text-[#232F3E] mb-6">Sign Up</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <input
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            />
          </div>
          <button type="submit" className="w-full bg-[#FF9900] text-white py-2 rounded-md hover:bg-[#E69500] transition">
            Register
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link href="/" className="text-[#FF9900] hover:underline">Sign In</Link>
        </p>
      </div>
    </main>
  );
}

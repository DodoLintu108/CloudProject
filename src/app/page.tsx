// src/app/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSignin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signin', username, password }),
    });
    if (res.ok) {
      const { IdToken } = await res.json();
      localStorage.setItem('token', IdToken);
      router.push('/tasks');
    } else {
      const { error } = await res.json();
      setError(error);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#232F3E] to-[#121417]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border-2 border-[#FF9900]">
        <Image
          src="/AWS_LOGO.png"
          alt="AWS Logo"
          width={48}
          height={48}
          className="mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-center text-[#232F3E] mb-6">Sign In</h1>
        <form onSubmit={handleSignin} className="space-y-4">
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            />
          </div>
          <button type="submit" className="w-full bg-[#FF9900] text-white py-2 rounded-md hover:bg-[#E69500] transition">
            Sign In
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        <p className="mt-4 text-center text-sm">
          No account? <Link href="/signup" className="text-[#FF9900] hover:underline">Sign up</Link>
        </p>
      </div>
    </main>
  );
}

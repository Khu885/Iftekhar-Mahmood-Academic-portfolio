"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, login } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    getMe()
      .then(() => {
        if (active) {
          router.replace("/admin");
        }
      })
      .catch(() => { });
    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-950">Admin Login</h2>
            <p className="text-sm text-gray-600">Enter your credentials to continue.</p>
          </div>
          {error && <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Username</span>
              <input className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Password</span>
              <input type="password" className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
          </div>
          <button disabled={loading} className="mt-5 w-full rounded-full bg-gray-900 px-4 py-2.5 text-white hover:bg-gray-800 disabled:opacity-60 transition-colors">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

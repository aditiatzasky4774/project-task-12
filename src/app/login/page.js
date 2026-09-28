"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Login dengan Email & Password
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Login berhasil!");

    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  // Login dengan Google
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Google Login Error:", error);
      setMessage(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">

      {/* Card Login */}
      <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-8 shadow-lg">

        {/* Header */}
        <div className="text-center">


          <h1 className="text-3xl font-bold text-blue-900">
            Login
          </h1>

          <p className="mt-2 text-gray-600">
            Masuk ke Papan Bantuan Warga.
          </p>

        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3.5 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
        >
          {googleLoading ? (
            "Menghubungkan ke Google..."
          ) : (
            <>
              <span className="text-lg">G</span>
              Login dengan Google
            </>
          )}
        </button>

        {/* Pembatas */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200"></div>

          <span className="text-sm text-gray-400">
            atau
          </span>

          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Button Login */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Login"}
          </button>

        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-5 rounded-xl border p-3 text-center text-sm font-medium ${
              message === "Login berhasil!"
                ? "border-green-100 bg-green-50 text-green-700"
                : "border-red-100 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </p>
        )}

        {/* Register */}
        <p className="mt-7 text-center text-sm text-gray-600">
          Belum punya akun?{" "}

          <Link
            href="/register"
            className="font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
          >
            Daftar
          </Link>
        </p>

      </div>
    </main>
  );
}
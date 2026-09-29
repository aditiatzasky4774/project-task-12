"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProfileData = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUser(user);

    const { data, error } = await supabase
      .from("help_requests")
      .select("*");

    if (error) {
      console.error("Gagal mengambil data:", error);
    } else {
      setRequests(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    getProfileData();
  }, []);

  const myRequests = requests.filter(
    (request) => request.user_id === user?.id
  );

  const helpedRequests = requests.filter(
    (request) => request.helper_id === user?.id
  );

  const completedRequests = requests.filter(
    (request) =>
      request.helper_id === user?.id && request.status === "selesai"
  );
  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 text-center shadow">
            <p className="text-gray-600">Memuat profil...</p>
          </div>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 text-center shadow">
            <h1 className="text-2xl font-bold text-gray-800">
              Kamu belum login
            </h1>

            <p className="mt-2 text-gray-600">
              Silakan login terlebih dahulu untuk melihat profil.
            </p>

            <Link
              href="/login"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900">
              Profil Saya
            </h1>

            <p className="mt-2 text-gray-600">
              Informasi akun dan aktivitas bantuan kamu.
            </p>
          </div>

          {/* Profile Card */}
          <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-6 shadow">
            <div className="flex flex-col items-center gap-4 sm:flex-row">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
                👤
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Warga Bantu
                </h2>

                <p className="mt-1 text-gray-600">
                  {user.email}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  User ID: {user.id}
                </p>
              </div>

            </div>
          </div>

          {/* Statistics */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow">
              <div className="text-3xl">📋</div>

              <p className="mt-3 text-sm text-gray-500">
                Bantuan Dibuat
              </p>

              <p className="mt-1 text-3xl font-bold text-blue-700">
                {myRequests.length}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow">
              <div className="text-3xl">🤝</div>

              <p className="mt-3 text-sm text-gray-500">
                Bantuan Dibantu
              </p>

              <p className="mt-1 text-3xl font-bold text-blue-700">
                {helpedRequests.length}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow">
              <div className="text-3xl">✅</div>

              <p className="mt-3 text-sm text-gray-500">
                Bantuan Selesai
              </p>

              <p className="mt-1 text-3xl font-bold text-green-600">
                {completedRequests.length}
              </p>
            </div>

          </div>

          {/* Account Information */}
          <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-6 shadow">

            <h2 className="text-xl font-bold text-gray-900">
              Informasi Akun
            </h2>

            <div className="mt-5 space-y-4">

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="font-medium text-gray-800">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Bergabung
                </p>

                <p className="font-medium text-gray-800">
                  {new Date(user.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>

            </div>

          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3 sm:flex-row">

            <Link
              href="/dashboard"
              className="flex-1 rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white transition hover:bg-blue-700"
            >
              ← Kembali ke Dashboard
            </Link>

            <Link
              href="/bantuan-saya"
              className="flex-1 rounded-lg border border-blue-200 bg-white px-5 py-3 text-center font-medium text-blue-700 transition hover:bg-blue-50"
            >
              📋 Bantuan Saya
            </Link>

          </div>

        </div>
      </main>
    </>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function BantuanSayaPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const getMyRequests = async () => {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Silakan login terlebih dahulu.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("help_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("Gagal mengambil data bantuan.");
    } else {
      setRequests(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    getMyRequests();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("help_requests")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      setMessage("Gagal menghapus permintaan bantuan.");
      return;
    }

    setRequests((prev) =>
      prev.filter((request) => request.id !== id)
    );

    setMessage("Permintaan bantuan berhasil dihapus.");
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bantuan Saya
          </h1>

          <p className="mt-2 text-gray-600">
            Daftar permintaan bantuan yang kamu buat.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            Memuat data...
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <h2 className="text-xl font-semibold">
              Belum ada permintaan bantuan
            </h2>

            <p className="mt-2 text-gray-600">
              Kamu belum membuat permintaan bantuan.
            </p>

            <Link
              href="/minta-bantu"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Minta Bantuan
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-xl bg-white p-6 shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {request.title}
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      request.status === "selesai"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>

                <p className="mt-4 text-gray-600">
                  {request.description}
                </p>

                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">
                      Kategori:
                    </span>{" "}
                    {request.category}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Lokasi:
                    </span>{" "}
                    {request.location}
                  </p>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link
                    href={`/bantuan/${request.id}`}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Detail
                  </Link>

                  <button
                    onClick={() => handleDelete(request.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {message && (
          <p className="mt-6 rounded-lg bg-white p-4 text-center text-sm text-gray-700 shadow">
            {message}
          </p>
        )}

      </div>
    </main>
  );
}
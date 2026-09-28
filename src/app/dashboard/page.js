"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");

  // Filter kategori
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Pencarian
  const [searchTerm, setSearchTerm] = useState("");

  // Daftar kategori
  const categories = [
    "Semua",
    "Medis & Darurat",
    "Sembako",
    "Peminjaman Alat",
    "Tenaga Relawan",
  ];

  // ==========================================
  // MENGAMBIL DATA BANTUAN
  // ==========================================
  const getRequests = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("help_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data:", error);
      setMessage("Gagal mengambil data bantuan.");
    } else {
      setRequests(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    getRequests();
  }, []);

  // ==========================================
  // HAPUS BANTUAN
  // ==========================================
  const handleDelete = async (id) => {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin menghapus permintaan bantuan ini?"
    );

    if (!yakin) {
      return;
    }

    setDeletingId(id);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Silakan login terlebih dahulu.");
      setDeletingId(null);
      return;
    }

    const { error } = await supabase
      .from("help_requests")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Gagal menghapus:", error);
      setMessage("Gagal menghapus permintaan bantuan.");
    } else {
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== id)
      );

      setMessage("Permintaan bantuan berhasil dihapus.");
    }

    setDeletingId(null);
  };

  // ==========================================
  // FILTER KATEGORI + SEARCH
  // ==========================================
  const filteredRequests = requests.filter((request) => {
    const categoryMatch =
      selectedCategory === "Semua" ||
      request.category === selectedCategory;

    const search = searchTerm.toLowerCase().trim();

    const searchMatch =
      request.title?.toLowerCase().includes(search) ||
      request.description?.toLowerCase().includes(search) ||
      request.location?.toLowerCase().includes(search);

    return categoryMatch && searchMatch;
  });

  // ==========================================
  // STATISTIK
  // ==========================================
  const totalRequests = requests.length;

  const waitingRequests = requests.filter(
    (request) => request.status === "menunggu"
  ).length;

  const helpedRequests = requests.filter(
    (request) => request.status === "dibantu"
  ).length;

  const completedRequests = requests.filter(
    (request) => request.status === "selesai"
  ).length;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-3 py-6 sm:px-4 sm:py-8">
        <div className="mx-auto max-w-6xl">

          {/* ==========================================
              HEADER
          ========================================== */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl font-bold text-blue-900 sm:text-3xl">
              Dashboard Bantuan
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
              Lihat dan bantu permintaan bantuan dari warga.
            </p>
          </div>

          {/* ==========================================
              STATISTIK
          ========================================== */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">

            {/* TOTAL */}
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">

                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">
                    Total Bantuan
                  </p>

                  <p className="mt-1 text-2xl font-bold text-blue-700 sm:mt-2 sm:text-3xl">
                    {totalRequests}
                  </p>
                </div>

                <div className="shrink-0 rounded-xl bg-blue-100 p-2.5 text-xl sm:p-3 sm:text-2xl">
                  📋
                </div>

              </div>
            </div>

            {/* MENUNGGU */}
            <div className="rounded-2xl border border-yellow-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">

                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">
                    Menunggu
                  </p>

                  <p className="mt-1 text-2xl font-bold text-yellow-600 sm:mt-2 sm:text-3xl">
                    {waitingRequests}
                  </p>
                </div>

                <div className="shrink-0 rounded-xl bg-yellow-100 p-2.5 text-xl sm:p-3 sm:text-2xl">
                  ⏳
                </div>

              </div>
            </div>

            {/* DIBANTU */}
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">

                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">
                    Sedang Dibantu
                  </p>

                  <p className="mt-1 text-2xl font-bold text-blue-600 sm:mt-2 sm:text-3xl">
                    {helpedRequests}
                  </p>
                </div>

                <div className="shrink-0 rounded-xl bg-blue-100 p-2.5 text-xl sm:p-3 sm:text-2xl">
                  🤝
                </div>

              </div>
            </div>

            {/* SELESAI */}
            <div className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">

                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">
                    Selesai
                  </p>

                  <p className="mt-1 text-2xl font-bold text-green-600 sm:mt-2 sm:text-3xl">
                    {completedRequests}
                  </p>
                </div>

                <div className="shrink-0 rounded-xl bg-green-100 p-2.5 text-xl sm:p-3 sm:text-2xl">
                  ✅
                </div>

              </div>
            </div>

          </div>

          {/* ==========================================
              PESAN
          ========================================== */}
          {message && (
            <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-3 text-center text-sm font-medium text-blue-700 sm:mb-6 sm:p-4">
              {message}
            </div>
          )}

          {/* ==========================================
              SEARCH + FILTER
          ========================================== */}
          <div className="mb-6 rounded-xl border border-blue-100 bg-white p-3 shadow sm:mb-8 sm:p-4">

            <div className="flex flex-col gap-4">

              {/* FILTER KATEGORI */}
              <div className="w-full overflow-x-auto pb-1">
                <div className="flex w-max gap-2">

                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white shadow"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}

                </div>
              </div>

              {/* SEARCH */}
              <div className="relative w-full">

                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔎
                </span>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari bantuan..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>
          </div>

          {/* ==========================================
              LOADING
          ========================================== */}
          {loading ? (

            <div className="rounded-xl bg-white p-8 text-center shadow">
              <p className="text-sm text-gray-600 sm:text-base">
                Memuat data bantuan...
              </p>
            </div>

          ) : filteredRequests.length === 0 ? (

            /* TIDAK ADA DATA */
            <div className="rounded-xl bg-white p-6 text-center shadow sm:p-8">

              <div className="text-4xl">
                🔎
              </div>

              <h2 className="mt-3 text-lg font-semibold text-gray-800 sm:text-xl">
                Tidak ada bantuan
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600">
                Tidak ditemukan bantuan yang sesuai dengan pencarian
                atau kategori yang dipilih.
              </p>

            </div>

          ) : (

            /* ==========================================
               DAFTAR BANTUAN
            ========================================== */
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">

              {filteredRequests.map((request) => (

                <div
                  key={request.id}
                  className="flex h-full flex-col rounded-xl border border-blue-100 bg-white p-4 shadow transition hover:shadow-lg sm:p-6"
                >

                  {/* JUDUL + STATUS */}
                  <div className="mb-4 flex items-start justify-between gap-2">

                    <h2 className="min-w-0 break-words text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                      {request.title}
                    </h2>

                    {/* STATUS */}
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium capitalize sm:px-3 sm:text-xs ${
                        request.status === "selesai"
                          ? "bg-green-100 text-green-700"
                          : request.status === "dibantu"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {request.status}
                    </span>

                  </div>

                  {/* DESKRIPSI */}
                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {request.description}
                  </p>

                  {/* INFORMASI */}
                  <div className="space-y-2 text-sm text-gray-700">

                    <p className="break-words">
                      <span className="font-semibold">
                        Kategori:
                      </span>{" "}
                      {request.category}
                    </p>

                    <p className="break-words">
                      <span className="font-semibold">
                        Lokasi:
                      </span>{" "}
                      {request.location}
                    </p>

                  </div>

                  {/* TOMBOL */}
                  <div className="mt-auto flex gap-2 pt-5 sm:gap-3">

                    {/* DETAIL */}
                    <Link
                      href={`/bantuan/${request.id}`}
                      className="flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-medium text-white transition hover:bg-blue-700 sm:px-4"
                    >
                      Lihat Detail
                    </Link>

                    {/* HAPUS */}
                    <button
                      onClick={() => handleDelete(request.id)}
                      disabled={deletingId === request.id}
                      className="shrink-0 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                    >
                      {deletingId === request.id
                        ? "Menghapus..."
                        : "Hapus"}
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      </main>
    </>
  );
}
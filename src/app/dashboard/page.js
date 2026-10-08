"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "Semua",
    "Medis & Darurat",
    "Sembako",
    "Peminjaman Alat",
    "Tenaga Relawan",
  ];

  // ==========================================
  // CEK LOGIN
  // ==========================================
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Jika belum login
      if (!user) {
        router.replace("/login");
        return;
      }

      // Jika sudah login
      getRequests();
    };

    checkUser();
  }, [router]);

  // ==========================================
  // AMBIL DATA BANTUAN
  // ==========================================
  const getRequests = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("help_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error mengambil data:", error);

      setMessage("Gagal mengambil data bantuan.");

      setLoading(false);

      return;
    }

    setRequests(data || []);

    setLoading(false);
  };

  // ==========================================
  // FILTER DATA
  // ==========================================
  const filteredRequests = requests.filter((request) => {
    const matchCategory =
      selectedCategory === "Semua" ||
      request.category === selectedCategory;

    const search = searchTerm.toLowerCase();

    const matchSearch =
      request.title?.toLowerCase().includes(search) ||
      request.description?.toLowerCase().includes(search) ||
      request.location?.toLowerCase().includes(search);

    return matchCategory && matchSearch;
  });

  // ==========================================
  // STATISTIK
  // ==========================================
  const totalRequests = requests.length;

  const waitingRequests = requests.filter(
    (request) => request.status === "menunggu"
  ).length;

  const helpingRequests = requests.filter(
    (request) =>
      request.status === "dibantu" ||
      request.status === "selesai"
  ).length;

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">

            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>

            <p className="text-gray-600">
              Memeriksa login dan memuat data...
            </p>

          </div>
        </main>
      </>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">

        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* =====================================
              HEADER
          ====================================== */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              <h1 className="text-3xl font-bold text-gray-800">
                Dashboard Bantuan Warga
              </h1>

              <p className="text-gray-600 mt-2">
                Temukan dan bantu warga yang membutuhkan.
              </p>

            </div>

            <Link
              href="/minta-bantu"
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold transition"
            >
              + Minta Bantuan
            </Link>

          </div>


          {/* =====================================
              MESSAGE
          ====================================== */}

          {message && (
            <div className="mb-6 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}


          {/* =====================================
              STATISTIK
          ====================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

            {/* TOTAL */}

            <div className="bg-white rounded-xl shadow-sm border p-6">

              <p className="text-gray-500 text-sm">
                Total Bantuan
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {totalRequests}
              </h2>

            </div>


            {/* MENUNGGU */}

            <div className="bg-white rounded-xl shadow-sm border p-6">

              <p className="text-gray-500 text-sm">
                Menunggu Bantuan
              </p>

              <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                {waitingRequests}
              </h2>

            </div>


            {/* DIBANTU */}

            <div className="bg-white rounded-xl shadow-sm border p-6">

              <p className="text-gray-500 text-sm">
                Sedang / Sudah Dibantu
              </p>

              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {helpingRequests}
              </h2>

            </div>

          </div>


          {/* =====================================
              FILTER & SEARCH
          ====================================== */}

          <div className="bg-white rounded-xl shadow-sm border p-5 mb-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* SEARCH */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Bantuan
                </label>

                <input
                  type="text"
                  placeholder="Cari judul, deskripsi, atau lokasi..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>


              {/* CATEGORY */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>

                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}

                </select>

              </div>

            </div>

          </div>


          {/* =====================================
              JUDUL DAFTAR
          ====================================== */}

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-xl font-bold text-gray-800">
              Daftar Bantuan
            </h2>

            <span className="text-sm text-gray-500">
              {filteredRequests.length} bantuan ditemukan
            </span>

          </div>


          {/* =====================================
              DATA KOSONG
          ====================================== */}

          {filteredRequests.length === 0 ? (

            <div className="bg-white rounded-xl border p-10 text-center">

              <div className="text-5xl mb-4">
                🤝
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Belum ada bantuan
              </h3>

              <p className="text-gray-500 mb-5">
                Belum ada data bantuan yang sesuai
                dengan pencarian kamu.
              </p>

              <Link
                href="/minta-bantu"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold"
              >
                Buat Permintaan Bantuan
              </Link>

            </div>

          ) : (

            /* =====================================
               LIST BANTUAN
            ====================================== */

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredRequests.map((request) => (

                <div
                  key={request.id}
                  className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition"
                >

                  <div className="p-6">

                    {/* STATUS */}

                    <div className="flex items-center justify-between mb-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === "menunggu"
                            ? "bg-yellow-100 text-yellow-700"
                            : request.status === "dibantu"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {request.status || "menunggu"}
                      </span>

                      <span className="text-xs text-gray-400">
                        {request.category || "Umum"}
                      </span>

                    </div>


                    {/* JUDUL */}

                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {request.title}
                    </h3>


                    {/* DESKRIPSI */}

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {request.description}
                    </p>


                    {/* LOKASI */}

                    {request.location && (

                      <div className="flex items-start gap-2 text-sm text-gray-500 mb-5">

                        <span>
                          📍
                        </span>

                        <span>
                          {request.location}
                        </span>

                      </div>

                    )}


                    {/* BUTTON */}

                    <div className="flex gap-2">

  <Link
    href={`/bantuan/${request.id}`}
    className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
  >
    Lihat Detail
  </Link>

</div>

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
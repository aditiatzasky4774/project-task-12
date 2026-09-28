"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DetailBantuanPage() {
  const params = useParams();

  const [request, setRequest] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [helping, setHelping] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const [message, setMessage] = useState("");

  // =========================
  // MENGAMBIL DATA USER
  // =========================
  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUser(user);
  };

  // =========================
  // MENGAMBIL DATA BANTUAN
  // =========================
  const getRequest = async () => {
    const { data, error } = await supabase
      .from("help_requests")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.error("Gagal mengambil data:", error);

      setMessage("Data bantuan tidak ditemukan.");
      setRequest(null);
    } else {
      setRequest(data);
    }

    setLoading(false);
  };

  // =========================
  // LOAD HALAMAN
  // =========================
  useEffect(() => {
    const loadPage = async () => {
      await getCurrentUser();

      if (params.id) {
        await getRequest();
      }
    };

    loadPage();
  }, [params.id]);

  // =========================
  // SAYA INGIN MEMBANTU
  // =========================
  const handleHelp = async () => {
    setHelping(true);
    setMessage("");

    // Ambil user yang sedang login
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Belum login
    if (!user) {
      setMessage("Silakan login terlebih dahulu.");
      setHelping(false);
      return;
    }

    // Data bantuan tidak ada
    if (!request) {
      setMessage("Data bantuan tidak ditemukan.");
      setHelping(false);
      return;
    }

    // =========================
    // TIDAK BOLEH MEMBANTU DIRI SENDIRI
    // =========================
    if (request.user_id === user.id) {
      setMessage(
        "Kamu tidak dapat membantu permintaan bantuan yang kamu buat sendiri."
      );

      setHelping(false);
      return;
    }

    // =========================
    // CEK STATUS
    // =========================
    if (request.status !== "menunggu") {
      setMessage(
        "Bantuan ini sudah diambil oleh pengguna lain atau sudah selesai."
      );

      setHelping(false);
      return;
    }

    // =========================
    // SIMPAN HELPER
    // =========================
    const { data, error } = await supabase
      .from("help_requests")
      .update({
        status: "dibantu",
        helper_id: user.id,
      })
      .eq("id", params.id)
      .eq("status", "menunggu")
      .select()
      .single();

    // Jika gagal
    if (error) {
      console.error("Gagal memperbarui bantuan:", error);

      setMessage(
        "Gagal mengambil permintaan bantuan. Mungkin bantuan ini sudah diambil orang lain."
      );

      setHelping(false);
      return;
    }

    // Update data di halaman
    setRequest(data);

    // Update current user
    setCurrentUser(user);

    setMessage(
      "Terima kasih! Kamu sekarang menjadi warga yang membantu permintaan ini."
    );

    setHelping(false);
  };

  // =========================
  // TANDAI BANTUAN SELESAI
  // =========================
  const handleFinish = async () => {
    setFinishing(true);
    setMessage("");

    // Ambil user yang sedang login
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Belum login
    if (!user) {
      setMessage("Silakan login terlebih dahulu.");
      setFinishing(false);
      return;
    }

    // Data bantuan tidak ada
    if (!request) {
      setMessage("Data bantuan tidak ditemukan.");
      setFinishing(false);
      return;
    }

    // =========================
    // HANYA HELPER YANG BOLEH MENYELESAIKAN
    // =========================
    if (request.helper_id !== user.id) {
      setMessage(
        "Hanya warga yang membantu yang dapat menandai bantuan sebagai selesai."
      );

      setFinishing(false);
      return;
    }

    // =========================
    // CEK STATUS
    // =========================
    if (request.status !== "dibantu") {
      setMessage(
        "Bantuan belum dalam status dibantu atau sudah selesai."
      );

      setFinishing(false);
      return;
    }

    // =========================
    // UPDATE STATUS
    // =========================
    const { data, error } = await supabase
      .from("help_requests")
      .update({
        status: "selesai",
      })
      .eq("id", params.id)
      .eq("helper_id", user.id)
      .eq("status", "dibantu")
      .select()
      .single();

    // Jika gagal
    if (error) {
      console.error("Gagal menyelesaikan bantuan:", error);

      setMessage(
        "Gagal menandai bantuan sebagai selesai. Silakan coba lagi."
      );

      setFinishing(false);
      return;
    }

    // Update tampilan
    setRequest(data);

    setMessage(
      "Bantuan berhasil diselesaikan. Terima kasih sudah membantu! 🎉"
    );

    setFinishing(false);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-lg">
          <p className="text-gray-600">
            Memuat detail bantuan...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // DATA TIDAK DITEMUKAN
  // =========================
  if (!request) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-lg">
          <p className="text-red-600">
            {message || "Bantuan tidak ditemukan."}
          </p>

          <Link
            href="/dashboard"
            className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // =========================
  // CEK APAKAH USER ADALAH HELPER
  // =========================
  const isHelper =
    currentUser?.id &&
    request.helper_id &&
    currentUser.id === request.helper_id;

  // =========================
  // CEK APAKAH USER PEMBUAT
  // =========================
  const isOwner =
    currentUser?.id &&
    request.user_id &&
    currentUser.id === request.user_id;

  // =========================
  // HALAMAN DETAIL
  // =========================
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
      <div className="mx-auto max-w-3xl">

        {/* KEMBALI */}
        <Link
          href="/dashboard"
          className="mb-6 inline-block font-medium text-blue-600 transition hover:text-blue-800 hover:underline"
        >
          ← Kembali ke Dashboard
        </Link>

        {/* CARD DETAIL */}
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg sm:p-8">

          {/* JUDUL + STATUS */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <h1 className="text-3xl font-bold text-blue-900">
              {request.title}
            </h1>

            <span
              className={`w-fit rounded-full px-4 py-1.5 text-sm font-semibold ${
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

          {/* INFORMASI BANTUAN */}
          <div className="mt-8 space-y-6">

            {/* DESKRIPSI */}
            <div className="rounded-xl bg-gray-50 p-5">
              <h2 className="font-semibold text-gray-800">
                Deskripsi
              </h2>

              <p className="mt-2 leading-relaxed text-gray-600">
                {request.description}
              </p>
            </div>

            {/* KATEGORI */}
            <div className="rounded-xl bg-blue-50 p-5">
              <h2 className="font-semibold text-blue-900">
                Kategori
              </h2>

              <p className="mt-2 text-blue-700">
                {request.category}
              </p>
            </div>

            {/* LOKASI */}
            <div className="rounded-xl bg-gray-50 p-5">
              <h2 className="font-semibold text-gray-800">
                Lokasi
              </h2>

              <p className="mt-2 text-gray-600">
                {request.location}
              </p>
            </div>

            {/* INFORMASI HELPER */}
            {request.status === "dibantu" &&
              request.helper_id && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">

                  <h2 className="font-semibold text-blue-900">
                    🤝 Informasi Bantuan
                  </h2>

                  <p className="mt-2 text-blue-700">
                    Permintaan bantuan ini sudah diambil oleh
                    seorang warga yang bersedia membantu.
                  </p>

                </div>
              )}

          </div>

          {/* =========================
              STATUS MENUNGGU
          ========================= */}
          {request.status === "menunggu" && (
            <>
              {/* PEMBUAT TIDAK BISA MEMBANTU DIRI SENDIRI */}
              {!isOwner && (
                <button
                  onClick={handleHelp}
                  disabled={helping}
                  className="mt-8 w-full rounded-xl bg-green-600 px-4 py-3.5 font-semibold text-white shadow-md transition hover:bg-green-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {helping
                    ? "Memproses..."
                    : "🤝 Saya Ingin Membantu"}
                </button>
              )}

              {/* INFORMASI PEMBUAT */}
              {isOwner && (
                <div className="mt-8 rounded-xl border border-yellow-100 bg-yellow-50 p-5 text-center">
                  <p className="font-semibold text-yellow-700">
                    Permintaan bantuan kamu sedang menunggu warga yang
                    bersedia membantu. ⏳
                  </p>
                </div>
              )}
            </>
          )}

          {/* =========================
              STATUS DIBANTU
          ========================= */}
          {request.status === "dibantu" && (
            <>
              {/* INFORMASI UNTUK SEMUA */}
              <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5 text-center">

                <p className="font-semibold text-blue-700">
                  Bantuan sedang dalam proses. 🤝
                </p>

                <p className="mt-1 text-sm text-blue-600">
                  Terima kasih sudah bersedia membantu warga.
                </p>

              </div>

              {/* =========================
                  TOMBOL SELESAI
                  HANYA UNTUK HELPER
              ========================= */}
              {isHelper && (
                <button
                  onClick={handleFinish}
                  disabled={finishing}
                  className="mt-4 w-full rounded-xl bg-green-600 px-4 py-3.5 font-semibold text-white shadow-md transition hover:bg-green-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {finishing
                    ? "Menyelesaikan..."
                    : "✅ Tandai Bantuan Selesai"}
                </button>
              )}

              {/* INFORMASI UNTUK PEMBUAT */}
              {isOwner && (
                <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-5 text-center">

                  <p className="font-medium text-gray-700">
                    Bantuan sedang dilakukan oleh warga yang membantu. 🤝
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Tunggu sampai warga yang membantu menandai bantuan ini
                    sebagai selesai.
                  </p>

                </div>
              )}
            </>
          )}

          {/* =========================
              STATUS SELESAI
          ========================= */}
          {request.status === "selesai" && (
            <div className="mt-8 rounded-xl border border-green-100 bg-green-50 p-5 text-center">

              <p className="font-semibold text-green-700">
                Bantuan ini sudah selesai. ✅
              </p>

              <p className="mt-1 text-sm text-green-600">
                Terima kasih atas kepedulian dan bantuan yang diberikan.
              </p>

            </div>
          )}

          {/* =========================
              PESAN
          ========================= */}
          {message && (
            <p className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-3 text-center text-sm font-medium text-blue-700">
              {message}
            </p>
          )}

        </div>
      </div>
    </main>
  );
}
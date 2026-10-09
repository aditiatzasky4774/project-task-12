"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

import Navbar from "@/components/Navbar";

const LocationPicker = dynamic(
  () => import("@/components/LocationPicker"),
  {
    ssr: false,
  }
);

export default function MintaBantuPage() {
  const router = useRouter();

  // ==============================
  // DATA FORM
  // ==============================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Medis & Darurat");
  const [location, setLocation] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // ==============================
  // KOORDINAT PETA
  // ==============================

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // ==============================
  // STATUS
  // ==============================

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ==============================
  // SAAT USER KLIK PETA
  // ==============================

  const handleLocationSelect = ({ latitude, longitude }) => {
    setLatitude(latitude);
    setLongitude(longitude);
  };

  // ==============================
  // SUBMIT FORM
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    // Cek apakah lokasi sudah dipilih
    if (latitude === null || longitude === null) {
      setMessage(
        "Silakan pilih lokasi bantuan pada peta terlebih dahulu."
      );

      setLoading(false);
      return;
    }

    // Ambil user yang sedang login
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Silakan login terlebih dahulu.");

      setLoading(false);
      return;
    }

    // ==============================
    // SIMPAN KE SUPABASE
    // ==============================

    const { error } = await supabase
      .from("help_requests")
      .insert([
        {
          title,
          description,
          category,
          location,
          whatsapp: whatsapp,
          status: "menunggu",
          user_id: user.id,

          // Koordinat lokasi dari peta
          latitude,
          longitude,
        },
      ]);

    // ==============================
    // JIKA ERROR
    // ==============================

    if (error) {
      console.error("Gagal membuat bantuan:", error);

      setMessage(
        "Gagal membuat permintaan bantuan. Silakan coba lagi."
      );

      setLoading(false);
      return;
    }

    // ==============================
    // BERHASIL
    // ==============================

    setMessage("Permintaan bantuan berhasil dibuat!");

    // Kosongkan form
    setTitle("");
    setDescription("");
    setCategory("Medis & Darurat");
    setLocation("");

    setLatitude(null);
    setLongitude(null);

    // Kembali ke Dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-8">

        <div className="mx-auto max-w-3xl">

          {/* ==============================
              KEMBALI
          ============================== */}

          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Kembali ke Dashboard
          </Link>


          {/* ==============================
              CARD FORM
          ============================== */}

          <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-xl md:p-8">

            {/* HEADER */}

            <div className="mb-8">

              <div className="mb-3 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                📢 Permintaan Bantuan
              </div>

              <h1 className="text-3xl font-bold text-blue-950">
                Minta Bantuan
              </h1>

              <p className="mt-2 text-gray-600">
                Sampaikan kebutuhan bantuan yang kamu perlukan
                kepada warga sekitar.
              </p>

            </div>


            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* ==============================
                  JUDUL
              ============================== */}

              <div>

                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Judul Bantuan
                </label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Butuh bantuan sembako"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* ==============================
                  DESKRIPSI
              ============================== */}

              <div>

                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Deskripsi Bantuan
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Jelaskan bantuan yang kamu butuhkan..."
                  required
                  rows={5}
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

{/* NOMOR WHATSAPP */}
<div>
  <label
    htmlFor="whatsapp"
    className="mb-2 block text-sm font-semibold text-gray-800"
  >
    Nomor WhatsApp
  </label>

  <input
    type="tel"
    id="whatsapp"
    value={whatsapp}
    onChange={(e) => setWhatsapp(e.target.value)}
    placeholder="Contoh: 081234567890"
    required
    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none"
  />

  <p className="mt-1 text-sm text-gray-600">
    Nomor ini akan digunakan orang lain untuk menghubungi kamu terkait bantuan.
  </p>
</div>

              {/* ==============================
                  KATEGORI
              ============================== */}

              <div>

                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Kategori
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Medis & Darurat">
                    Medis & Darurat
                  </option>

                  <option value="Sembako">
                    Sembako
                  </option>

                  <option value="Peminjaman Alat">
                    Peminjaman Alat
                  </option>

                  <option value="Tenaga Relawan">
                    Tenaga Relawan
                  </option>
                </select>

              </div>


              {/* ==============================
                  NAMA LOKASI
              ============================== */}

              <div>

                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Nama Lokasi
                </label>

                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  placeholder="Contoh: Batam"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Tulis nama lokasi secara manual, kemudian
                  pilih titik lokasi pada peta.
                </p>

              </div>


              {/* ==============================
                  PETA
              ============================== */}

              <div>

                <div className="mb-3">

                  <h2 className="text-lg font-bold text-gray-900">
                    📍 Pilih Lokasi di Peta
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Klik pada peta untuk menentukan lokasi
                    bantuan.
                  </p>

                </div>


                <LocationPicker
                  latitude={latitude}
                  longitude={longitude}
                  onLocationSelect={handleLocationSelect}
                />

              </div>


              {/* ==============================
                  KOORDINAT
              ============================== */}

              {latitude !== null &&
                longitude !== null && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                    <p className="text-sm font-semibold text-green-800">
                      ✓ Lokasi berhasil dipilih
                    </p>

                    <div className="mt-2 text-sm text-green-700">

                      <p>
                        Latitude:{" "}
                        <span className="font-mono">
                          {latitude.toFixed(6)}
                        </span>
                      </p>

                      <p>
                        Longitude:{" "}
                        <span className="font-mono">
                          {longitude.toFixed(6)}
                        </span>
                      </p>

                    </div>

                  </div>
                )}


              {/* ==============================
                  TOMBOL
              ============================== */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Mengirim..."
                  : "Kirim Permintaan Bantuan"}
              </button>


              {/* ==============================
                  PESAN
              ============================== */}

              {message && (
                <div className="rounded-xl bg-blue-50 p-4 text-center text-sm font-medium text-blue-700">
                  {message}
                </div>
              )}

            </form>

          </div>

        </div>

      </main>
    </>
  );
}
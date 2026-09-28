"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";

// Leaflet hanya dijalankan di browser
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">

        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700">

          {/* Background dekorasi */}
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

            {/* HERO TEXT */}
            <div className="text-white">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                🤝 Platform Bantuan Warga
              </div>

              <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
                Saling Membantu,
                <span className="block text-cyan-300">
                dan Menolong
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
                Warga Bantu adalah platform yang membantu warga
                menyampaikan kebutuhan bantuan dan menghubungkan mereka
                dengan warga lain yang ingin membantu.
              </p>

              {/* BUTTON */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">

                <Link
                  href="/minta-bantu"
                  className="rounded-xl bg-white px-7 py-3.5 text-center font-bold text-blue-700 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-blue-50"
                >
                  + Minta Bantuan
                </Link>

                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-center font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/20"
                >
                  Lihat Bantuan →
                </Link>

              </div>

              {/* MINI INFO */}
              <div className="mt-10 flex flex-wrap gap-8">

                <div>
                  <p className="text-2xl font-bold">
                    📢
                  </p>
                  <p className="mt-1 text-sm text-blue-200">
                    Minta bantuan
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold">
                    🤝
                  </p>
                  <p className="mt-1 text-sm text-blue-200">
                    Bantu warga
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold">
                    📍
                  </p>
                  <p className="mt-1 text-sm text-blue-200">
                    Berbasis lokasi
                  </p>
                </div>

              </div>
            </div>


            {/* HERO CARD */}
            <div className="relative">

              <div className="absolute -inset-5 rounded-[2rem] bg-white/10 blur-2xl" />

              <div className="relative rounded-[2rem] border border-white/20 bg-white p-7 shadow-2xl sm:p-9">

                {/* Header card */}
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      WARGA BANTU
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                      Mari Peduli Sesama
                    </h2>
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
                    🤝
                  </div>

                </div>

                {/* Request preview */}
                <div className="mt-7 rounded-2xl border border-gray-100 bg-slate-50 p-5">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Permintaan Bantuan
                      </p>

                      <h3 className="mt-2 text-lg font-bold text-gray-900">
                        Warga membutuhkan bantuan
                      </h3>
                    </div>

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                      Menunggu
                    </span>

                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Warga sekitar dapat melihat permintaan bantuan
                    dan memberikan bantuan sesuai kemampuan.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    📍 Lokasi warga
                  </div>

                </div>

                {/* Card features */}
                <div className="mt-5 grid grid-cols-3 gap-3">

                  <div className="rounded-2xl bg-blue-50 p-4 text-center">
                    <div className="text-2xl">
                      📢
                    </div>

                    <p className="mt-2 text-xs font-bold text-blue-700">
                      Minta
                    </p>
                  </div>

                  <div className="rounded-2xl bg-green-50 p-4 text-center">
                    <div className="text-2xl">
                      🤝
                    </div>

                    <p className="mt-2 text-xs font-bold text-green-700">
                      Bantu
                    </p>
                  </div>

                  <div className="rounded-2xl bg-yellow-50 p-4 text-center">
                    <div className="text-2xl">
                      ❤️
                    </div>

                    <p className="mt-2 text-xs font-bold text-yellow-700">
                      Peduli
                    </p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </section>


        {/* =====================================================
            STATISTIK / HIGHLIGHT
        ===================================================== */}
        <section className="border-b border-gray-100 bg-white px-6 py-10">

          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">

            <div className="group rounded-2xl border border-blue-100 bg-blue-50 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white">
                  📋
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Permintaan Bantuan
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Warga dapat menyampaikan kebutuhan
                  </p>
                </div>

              </div>

            </div>


            <div className="group rounded-2xl border border-green-100 bg-green-50 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-2xl text-white">
                  🤝
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Warga Membantu
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Hubungkan warga yang membutuhkan
                  </p>
                </div>

              </div>

            </div>


            <div className="group rounded-2xl border border-yellow-100 bg-yellow-50 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500 text-2xl text-white">
                  ❤️
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Peduli Sesama
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Membangun lingkungan yang peduli
                  </p>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* =====================================================
            FITUR
        ===================================================== */}
        <section className="bg-slate-50 px-6 py-20">

          <div className="mx-auto max-w-7xl">

            <div className="mx-auto max-w-2xl text-center">

              <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                FITUR UTAMA
              </span>

              <h2 className="mt-5 text-3xl font-bold text-gray-900 sm:text-4xl">
                Semua untuk Saling Membantu
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Warga Bantu menyediakan beberapa fitur yang
                mempermudah warga dalam meminta dan memberikan bantuan.
              </p>

            </div>


            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

              {/* FEATURE 1 */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                  📢
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  Minta Bantuan
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Buat permintaan bantuan dan jelaskan kebutuhan
                  yang sedang diperlukan.
                </p>

              </div>


              {/* FEATURE 2 */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                  🤝
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  Saya Ingin Membantu
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Temukan permintaan bantuan dan bantu warga
                  sesuai kemampuan.
                </p>

              </div>


              {/* FEATURE 3 */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                  📍
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  Peta Lokasi
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Lihat lokasi permintaan bantuan melalui
                  peta interaktif.
                </p>

              </div>


              {/* FEATURE 4 */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-2xl">
                  📊
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  Status Bantuan
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Pantau bantuan mulai dari menunggu,
                  dibantu, hingga selesai.
                </p>

              </div>

            </div>

          </div>
        </section>


        {/* =====================================================
            MAP
        ===================================================== */}
        <section className="bg-white px-6 py-20">

          <div className="mx-auto max-w-7xl">

            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

              <div>

                <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                  📍 PETA INTERAKTIF
                </span>

                <h2 className="mt-5 text-3xl font-bold text-gray-900 sm:text-4xl">
                  Bantuan di Sekitar Warga
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                  Lihat lokasi permintaan bantuan warga melalui
                  peta interaktif yang terhubung dengan database.
                </p>

              </div>

              <Link
                href="/dashboard"
                className="w-fit rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
              >
                Lihat Semua Bantuan →
              </Link>

            </div>


            {/* MAP CONTAINER */}
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 p-2 shadow-xl">

              <div className="h-[450px] overflow-hidden rounded-2xl">
                <Map />
              </div>

            </div>


          </div>
        </section>


        {/* =====================================================
            CARA KERJA
        ===================================================== */}
        <section className="bg-slate-50 px-6 py-20">

          <div className="mx-auto max-w-7xl">

            <div className="mx-auto max-w-2xl text-center">

              <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                CARA KERJA
              </span>

              <h2 className="mt-5 text-3xl font-bold text-gray-900 sm:text-4xl">
                Bagaimana Cara Kerjanya?
              </h2>

              <p className="mt-3 text-gray-600">
                Hanya dengan beberapa langkah sederhana.
              </p>

            </div>


            <div className="relative mt-14 grid gap-8 md:grid-cols-4">

              {/* STEP 1 */}
              <div className="relative rounded-2xl bg-white p-6 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-lg">
                  1
                </div>

                <h3 className="mt-5 font-bold text-gray-900">
                  Daftar
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Buat akun Warga Bantu untuk menggunakan
                  fitur bantuan.
                </p>

              </div>


              {/* STEP 2 */}
              <div className="relative rounded-2xl bg-white p-6 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-lg">
                  2
                </div>

                <h3 className="mt-5 font-bold text-gray-900">
                  Minta Bantuan
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Sampaikan kebutuhan bantuan yang
                  sedang diperlukan.
                </p>

              </div>


              {/* STEP 3 */}
              <div className="relative rounded-2xl bg-white p-6 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-lg">
                  3
                </div>

                <h3 className="mt-5 font-bold text-gray-900">
                  Warga Membantu
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Warga lain melihat dan mengambil
                  permintaan bantuan.
                </p>

              </div>


              {/* STEP 4 */}
              <div className="relative rounded-2xl bg-white p-6 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-lg">
                  4
                </div>

                <h3 className="mt-5 font-bold text-gray-900">
                  Selesai
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Bantuan selesai dan status diperbarui.
                </p>

              </div>

            </div>

          </div>
        </section>


        {/* =====================================================
            CTA
        ===================================================== */}
        <section className="px-6 py-20">

          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-16 text-center shadow-2xl sm:px-12">

            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="relative">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                🤝
              </div>

              <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
                Mari Saling Membantu
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100">
                Satu bantuan kecil dapat memberikan manfaat besar
                bagi orang lain. Mari membangun lingkungan yang
                lebih peduli bersama.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

                <Link
                  href="/register"
                  className="rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
                >
                  Daftar Sekarang
                </Link>

                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20"
                >
                  Temukan Bantuan
                </Link>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            FOOTER
        ===================================================== */}
        <footer className="border-t border-gray-200 bg-white">

          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">

            <div>

              <p className="text-xl font-bold">
                <span className="text-blue-600">
                  Warga
                </span>

                <span className="text-green-600">
                  {" "}Bantu
                </span>
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Saling membantu, dan menolong.
              </p>

            </div>

            <div className="text-sm text-gray-400">
              © 2026 Warga Bantu
            </div>

          </div>

        </footer>

      </main>
    </>
  );
}
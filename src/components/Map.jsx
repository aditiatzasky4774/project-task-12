"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { supabase } from "@/lib/supabase";

// Memperbaiki icon marker Leaflet di Next.js
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function Map() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Posisi awal peta
  // Hanya sebagai titik awal tampilan peta,
  // bukan lokasi GPS pengguna.
  const defaultPosition = [0.5071, 101.4478];

  // ==============================
  // MENGAMBIL DATA BANTUAN
  // ==============================
  const getRequests = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("help_requests")
      .select(
        "id, title, description, category, location, status, latitude, longitude"
      )
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Gagal mengambil data peta:", error);
      setLoading(false);
      return;
    }

    setRequests(data || []);
    setLoading(false);
  };

  // ==============================
  // LOAD DATA
  // ==============================
  useEffect(() => {
    getRequests();

    // ==============================
    // REALTIME SUPABASE
    // ==============================

    const channel = supabase
      .channel("help_requests_map")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "help_requests",
        },
        () => {
          getRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-lg">
      
      {/* Loading */}
      {loading && (
        <div className="absolute left-4 top-4 z-[1000] rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow">
          Memuat lokasi bantuan...
        </div>
      )}

      {/* Informasi jumlah bantuan */}
      <div className="absolute right-4 top-4 z-[1000] rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow">
        📍 {requests.length} lokasi bantuan
      </div>

      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={true}
        className="h-[500px] w-full"
      >
        {/* ==============================
            OPEN STREET MAP
        ============================== */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ==============================
            MARKER BANTUAN
        ============================== */}
        {requests.map((request) => (
          <Marker
            key={request.id}
            position={[
              Number(request.latitude),
              Number(request.longitude),
            ]}
          >
            <Popup>
              <div className="min-w-[220px]">
                <h3 className="text-base font-bold text-blue-900">
                  {request.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  {request.description}
                </p>

                <div className="mt-3 space-y-1 text-sm">
                  <p>
                    <strong>Kategori:</strong>{" "}
                    {request.category}
                  </p>

                  <p>
                    <strong>Lokasi:</strong>{" "}
                    {request.location}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {request.status}
                  </p>
                </div>

                <Link
                  href={`/bantuan/${request.id}`}
                  className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Lihat Detail
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Jika belum ada lokasi */}
      {!loading && requests.length === 0 && (
        <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-xl bg-white px-5 py-3 text-center shadow-lg">
          <p className="text-sm font-medium text-gray-700">
            Belum ada bantuan yang memiliki lokasi pada peta.
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Tambahkan lokasi saat membuat permintaan bantuan.
          </p>
        </div>
      )}
    </div>
  );
}
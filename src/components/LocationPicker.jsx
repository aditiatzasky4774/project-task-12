"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { useState } from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// ==========================================
// ICON MARKER LEAFLET
// ==========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// ==========================================
// KOMPONEN UNTUK MEMINDAHKAN PETA
// ==========================================

function MapController({ position }) {
  const map = useMap();

  if (position) {
    map.flyTo(position, 16, {
      duration: 1.5,
    });
  }

  return null;
}


// ==========================================
// KOMPONEN KLIK PETA
// ==========================================

function LocationMarker({ position, onLocationSelect }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

      onLocationSelect({
        latitude: lat,
        longitude: lng,
      });
    },
  });

  if (!position) {
    return null;
  }

  return <Marker position={position} />;
}


// ==========================================
// LOCATION PICKER
// ==========================================

export default function LocationPicker({
  latitude,
  longitude,
  onLocationSelect,
}) {
  const defaultPosition = [0.5071, 101.4478];

  const selectedPosition =
    latitude !== null && longitude !== null
      ? [Number(latitude), Number(longitude)]
      : null;

  const center = selectedPosition || defaultPosition;

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  // ==========================================
  // GUNAKAN LOKASI USER
  // ==========================================

  const handleUseMyLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "Browser kamu tidak mendukung fitur lokasi."
      );

      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Kirim koordinat ke halaman Minta Bantuan
        onLocationSelect({
          latitude,
          longitude,
        });

        setLoadingLocation(false);
      },

      (error) => {
        console.error("Lokasi gagal:", error);

        if (error.code === 1) {
          setLocationError(
            "Izin lokasi ditolak. Silakan izinkan lokasi dari browser."
          );
        } else if (error.code === 2) {
          setLocationError(
            "Lokasi tidak dapat ditemukan."
          );
        } else if (error.code === 3) {
          setLocationError(
            "Waktu mendapatkan lokasi habis. Coba lagi."
          );
        } else {
          setLocationError(
            "Terjadi masalah saat mengambil lokasi."
          );
        }

        setLoadingLocation(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };


  return (
    <div className="space-y-3">

      {/* ========================================
          TOMBOL LOKASI SAYA
      ======================================== */}

      <button
        type="button"
        onClick={handleUseMyLocation}
        disabled={loadingLocation}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingLocation ? (
          <>
            <span>⏳</span>
            Mencari lokasi kamu...
          </>
        ) : (
          <>
            <span>📍</span>
            Gunakan Lokasi Saya
          </>
        )}
      </button>


      {/* ========================================
          ERROR LOKASI
      ======================================== */}

      {locationError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {locationError}
        </div>
      )}


      {/* ========================================
          PETA
      ======================================== */}

      <div className="overflow-hidden rounded-2xl border border-blue-100 shadow-sm">

        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          className="h-[400px] w-full"
        >

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker
            position={selectedPosition}
            onLocationSelect={onLocationSelect}
          />

          <MapController
            position={selectedPosition}
          />

        </MapContainer>

      </div>


      {/* ========================================
          PETUNJUK
      ======================================== */}

      <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600">

        <p>
          💡 <strong>Cara menggunakan:</strong>
        </p>

        <p className="mt-1">
          Klik <strong>"Gunakan Lokasi Saya"</strong> untuk
          menggunakan lokasi perangkat kamu, atau klik
          langsung pada peta untuk memilih lokasi secara manual.
        </p>

      </div>

    </div>
  );
}
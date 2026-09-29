"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);

  useEffect(() => {
  let notificationChannel = null;

  const getUserAndNotifications = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setNotifications(data || []);

    // Realtime sementara dimatikan untuk memastikan Navbar bisa compile
    notificationChannel = supabase.channel(
      `notifications-${user.id}`
    );

    notificationChannel.subscribe((status) => {
      console.log("Status realtime:", status);
    });
  };

  getUserAndNotifications();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user || null);
  });

  return () => {
    subscription.unsubscribe();

    if (notificationChannel) {
      supabase.removeChannel(notificationChannel);
    }
  };
}, []);

  // ================================
  // NAVBAR HIDE / SHOW SAAT SCROLL
  // ================================
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scroll ke bawah → navbar menghilang
        setHideNavbar(true);
      } else {
        // Scroll ke atas → navbar muncul
        setHideNavbar(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ================================
  // LOGOUT
  // ================================
  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUser(null);
    setNotifications([]);
    setShowMenu(false);
    setShowNotifications(false);

    router.push("/login");
  };

  // ================================
  // JUMLAH NOTIFIKASI BELUM DIBACA
  // ================================
  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  // ================================
  // KLIK NOTIFIKASI
  // ================================
  const markAsRead = async (notification) => {
    if (!notification.is_read) {
      const { error } = await supabase
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq("id", notification.id);

      if (error) {
        console.error(
          "Error menandai notifikasi:",
          error
        );
      }

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                is_read: true,
              }
            : item
        )
      );
    }

    setShowNotifications(false);

    // Buka detail bantuan
    if (notification.request_id) {
      router.push(
        `/bantuan/${notification.request_id}`
      );
    }
  };

  // ================================
  // TANDAI SEMUA SUDAH DIBACA
  // ================================
  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) {
      return;
    }

    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      console.error(
        "Error menandai semua notifikasi:",
        error
      );
      return;
    }

    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        is_read: true,
      }))
    );
  };

  // ================================
  // CEK MENU AKTIF
  // ================================
  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav
  className={`sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm transition-transform duration-300 ${
    hideNavbar ? "-translate-y-full" : "translate-y-0"
  }`}
>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

        {/* ================================
            LOGO
        ================================= */}
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <div>
            <h1 className="text-xl font-bold tracking-tight">
            <span className="text-blue-600">Warga</span>{" "}
            <span className="text-emerald-500">Bantu</span>
            </h1>
          </div>
        </Link>

        {/* ================================
            DESKTOP MENU
        ================================= */}
        <div className="hidden items-center gap-6 md:flex">

          <Link
            href="/dashboard"
            className={`text-sm font-medium transition ${
              isActive("/dashboard")
                ? "text-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/minta-bantu"
            className={`text-sm font-medium transition ${
              isActive("/minta-bantu")
                ? "text-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            Minta Bantuan
          </Link>

          <Link
            href="/bantuan-saya"
            className={`text-sm font-medium transition ${
              isActive("/bantuan-saya")
                ? "text-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            Bantuan Saya
          </Link>

          <Link
            href="/profil"
            className={`text-sm font-medium transition ${
              isActive("/profil")
                ? "text-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            Profil
          </Link>

          {/* ================================
              NOTIFIKASI
          ================================= */}
          {user && (
            <div className="relative">
              <button
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-xl hover:bg-gray-100"
              >
                🔔

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                    {unreadCount > 9
                      ? "9+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationDropdown
                  notifications={notifications}
                  unreadCount={unreadCount}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
                />
              )}
            </div>
          )}

          {/* ================================
              USER
          ================================= */}
          {user ? (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-5">

              <div className="hidden text-right lg:block">
                <p className="text-sm font-medium text-gray-800">
                  {user.email}
                </p>

                <p className="text-xs text-gray-500">
                  Pengguna
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">

              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Daftar
              </Link>

            </div>
          )}
        </div>

        {/* ================================
            MOBILE BUTTON
        ================================= */}
        <button
          onClick={() =>
            setShowMenu(!showMenu)
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl hover:bg-gray-100 md:hidden"
        >
          {showMenu ? "✕" : "☰"}
        </button>
      </div>

      {/* ================================
          MOBILE MENU
      ================================= */}
      {showMenu && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">

          <div className="flex flex-col gap-2">

            <Link
              href="/dashboard"
              onClick={() =>
                setShowMenu(false)
              }
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                isActive("/dashboard")
                  ? "bg-green-50 text-green-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/minta-bantu"
              onClick={() =>
                setShowMenu(false)
              }
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                isActive("/minta-bantu")
                  ? "bg-green-50 text-green-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Minta Bantuan
            </Link>

            <Link
              href="/bantuan-saya"
              onClick={() =>
                setShowMenu(false)
              }
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                isActive("/bantuan-saya")
                  ? "bg-green-50 text-green-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Bantuan Saya
            </Link>

            <Link
              href="/profil"
              onClick={() =>
                setShowMenu(false)
              }
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                isActive("/profil")
                  ? "bg-green-50 text-green-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Profil
            </Link>

            {/* MOBILE NOTIFICATION */}
            {user && (
              <button
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
                className="flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span>
                  🔔 Notifikasi
                </span>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            <div className="my-2 border-t border-gray-200"></div>

            {user ? (
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-100"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() =>
                    setShowMenu(false)
                  }
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() =>
                    setShowMenu(false)
                  }
                  className="rounded-lg bg-green-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-green-700"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

/* =====================================================
   NOTIFICATION DROPDOWN
===================================================== */

function NotificationDropdown({
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
}) {
  return (
    <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">

        <div>
          <h3 className="font-semibold text-gray-900">
            Notifikasi
          </h3>

          <p className="text-xs text-gray-500">
            {unreadCount > 0
              ? `${unreadCount} belum dibaca`
              : "Semua sudah dibaca"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-medium text-green-600 hover:text-green-700"
          >
            Tandai semua
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="max-h-96 overflow-y-auto">

        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">

            <div className="mb-2 text-3xl">
              🔔
            </div>

            <p className="text-sm font-medium text-gray-700">
              Belum ada notifikasi
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Notifikasi baru akan muncul di sini.
            </p>

          </div>
        ) : (
          notifications.map(
            (notification) => (
              <button
                key={notification.id}
                onClick={() =>
                  markAsRead(notification)
                }
                className={`w-full border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 ${
                  !notification.is_read
                    ? "bg-green-50"
                    : "bg-white"
                }`}
              >

                <div className="flex gap-3">

                  {/* ICON */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                    {notification.type ===
                    "bantuan"
                      ? "🤝"
                      : notification.type ===
                        "selesai"
                      ? "✅"
                      : "🔔"}
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-2">

                      <h4
                        className={`text-sm ${
                          !notification.is_read
                            ? "font-semibold text-gray-900"
                            : "font-medium text-gray-700"
                        }`}
                      >
                        {notification.title ||
                          "Notifikasi"}
                      </h4>

                      {!notification.is_read && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-600"></span>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      {notification.message ||
                        "Ada notifikasi baru."}
                    </p>

                    {notification.created_at && (
                      <p className="mt-1 text-[11px] text-gray-400">
                        {new Date(
                          notification.created_at
                        ).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    )}

                  </div>
                </div>
              </button>
            )
          )
        )}
      </div>
    </div>
  );
}
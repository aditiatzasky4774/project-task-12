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

  useEffect(() => {
    let notificationChannel;

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

      notificationChannel = supabase
  .channel(`notifications-${user.id}`)
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "notifications",
    },
    (payload) => {
      if (payload.new.user_id === user.id) {
        setNotifications((current) => [
          payload.new,
          ...current,
        ]);
      }
    }
  )
  .subscribe();
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

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUser(null);
    setNotifications([]);
    setShowMenu(false);

    router.push("/login");
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const markAsRead = async (notification) => {
    if (!notification.is_read) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notification.id);

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, is_read: true }
            : item
        )
      );
    }

    setShowNotifications(false);

    if (notification.request_id) {
      router.push(`/bantuan/${notification.request_id}`);
    }
  };

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        is_read: true,
      }))
    );
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link
          href="/dashboard"
          className="text-xl font-bold whitespace-nowrap"
          onClick={() => setShowMenu(false)}
        >
          <span className="text-blue-600">Warga</span>
          <span className="text-green-600"> Bantu</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-6 md:flex">

          <Link
            href="/dashboard"
            className={`text-sm font-medium transition ${
              isActive("/dashboard")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/minta-bantu"
            className={`text-sm font-medium transition ${
              isActive("/minta-bantu")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Minta Bantuan
          </Link>

          <Link
            href="/bantuan-saya"
            className={`text-sm font-medium transition ${
              isActive("/bantuan-saya")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Bantuan Saya
          </Link>

          <Link
            href="/profil"
            className={`text-sm font-medium transition ${
              isActive("/profil")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Profil
          </Link>

          {/* NOTIFICATION */}
          <div className="relative">
            <button
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
              className="relative rounded-full p-2 text-xl transition hover:bg-gray-100"
              aria-label="Notifikasi"
            >
              🔔

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                onRead={markAsRead}
                onMarkAll={markAllAsRead}
              />
            )}
          </div>

          {/* LOGOUT */}
          {user && (
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>

        {/* MOBILE RIGHT */}
        <div className="flex items-center gap-2 md:hidden">

          {/* MOBILE NOTIFICATION */}
          <div className="relative">
            <button
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
              className="relative rounded-full p-2 text-xl hover:bg-gray-100"
              aria-label="Notifikasi"
            >
              🔔

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                onRead={markAsRead}
                onMarkAll={markAllAsRead}
                mobile
              />
            )}
          </div>

          {/* HAMBURGER */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg p-2 text-2xl text-gray-700 hover:bg-gray-100"
            aria-label="Buka menu"
          >
            {showMenu ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {showMenu && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">

          <div className="flex flex-col gap-2">

            <Link
              href="/dashboard"
              onClick={() => setShowMenu(false)}
              className={`rounded-lg px-4 py-3 font-medium ${
                isActive("/dashboard")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              🏠 Dashboard
            </Link>

            <Link
              href="/minta-bantu"
              onClick={() => setShowMenu(false)}
              className={`rounded-lg px-4 py-3 font-medium ${
                isActive("/minta-bantu")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              🙏 Minta Bantuan
            </Link>

            <Link
              href="/bantuan-saya"
              onClick={() => setShowMenu(false)}
              className={`rounded-lg px-4 py-3 font-medium ${
                isActive("/bantuan-saya")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              🤝 Bantuan Saya
            </Link>

            <Link
              href="/profil"
              onClick={() => setShowMenu(false)}
              className={`rounded-lg px-4 py-3 font-medium ${
                isActive("/profil")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              👤 Profil
            </Link>

            {user && (
              <button
                onClick={handleLogout}
                className="mt-2 rounded-lg bg-red-500 px-4 py-3 font-medium text-white hover:bg-red-600"
              >
                🚪 Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}


/* ================================
   NOTIFICATION DROPDOWN
================================ */

function NotificationDropdown({
  notifications,
  unreadCount,
  onRead,
  onMarkAll,
  mobile = false,
}) {
  return (
    <div
      className={`
        absolute top-12 z-50 w-[calc(100vw-32px)] max-w-sm
        overflow-hidden rounded-xl border border-gray-200
        bg-white shadow-xl
        ${mobile ? "right-0" : "right-0"}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold text-gray-800">
          Notifikasi
        </h3>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAll}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            Tandai semua
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className="max-h-80 overflow-y-auto">

        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            Belum ada notifikasi.
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => onRead(notification)}
              className={`w-full border-b px-4 py-3 text-left transition hover:bg-gray-50 ${
                !notification.is_read
                  ? "bg-blue-50"
                  : "bg-white"
              }`}
            >
              <div className="flex gap-3">

                <div className="mt-1 text-lg">
                  {notification.type === "help_taken"
                    ? "🤝"
                    : "✅"}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {notification.title}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-gray-600">
                    {notification.message}
                  </p>

                  {!notification.is_read && (
                    <span className="mt-2 inline-block text-[10px] font-semibold text-blue-600">
                      BELUM DIBACA
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}

      </div>
    </div>
  );
}
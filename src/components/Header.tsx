"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, token } = useAuth();

  // Token yoksa header'ı gösterme
  if (!token) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) => {
    return pathname === path
      ? "bg-blue-400 cursor-default"
      : "bg-blue-800 hover:bg-blue-700";
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between  py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">RMOS Dashboard</h1>
            <nav className="flex space-x-4 ">
              <Link
                href="/forecast"
                className={`px-4 py-2 text-white rounded-md transition-colors ${isActive(
                  "/forecast"
                )}`}
              >
                Forecast
              </Link>
              <Link
                href="/blacklist"
                className={`px-4 py-2 text-white rounded-md transition-colors ${isActive(
                  "/blacklist"
                )}`}
              >
                Blacklist
              </Link>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </header>
  );
}

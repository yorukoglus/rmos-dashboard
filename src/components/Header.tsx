"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, token } = useAuth();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  const isActive = useCallback(
    (path: string) => {
      return pathname === path
        ? "bg-blue-400 cursor-default"
        : "bg-blue-800 hover:bg-blue-700";
    },
    [pathname]
  );

  if (!token) return null;

  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">RMOS Dashboard</h1>
            <nav className="flex space-x-4">
              <Link
                href="/forecast"
                className={`px-4 py-2 text-white rounded-md transition-colors ${isActive(
                  "/forecast"
                )}`}
              >
                {t("forecast.title")}
              </Link>
              <Link
                href="/blacklist"
                className={`px-4 py-2 text-white rounded-md transition-colors ${isActive(
                  "/blacklist"
                )}`}
              >
                {t("blacklist.title")}
              </Link>
            </nav>
          </div>
          <div className="flex justify-between items-center gap-4">
            <select
              onChange={handleLanguageChange}
              value={i18n.language}
              className="border border-blue-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="tr">{t("common.turkish")}</option>
              <option value="en">{t("common.english")}</option>
            </select>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              {t("common.logout")}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

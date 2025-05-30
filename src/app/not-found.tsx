"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-1 items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <div className="text-6xl font-semibold text-blue-800 mb-8">
          {t("common.pageNotFound")}
        </div>
        <p className="text-xl text-blue-700 mb-8">
          {t("common.pageNotFoundDescription")}
        </p>
        <Link
          href="/forecast"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          {t("common.backToHome")}
        </Link>
      </div>
    </div>
  );
}

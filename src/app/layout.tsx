"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/stores/AuthContext";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import Notification from "@/components/Notification";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="tr">
      <head>
        <title>RMOS Dashboard</title>
        <meta name="description" content="RMOS Dashboard Application" />
      </head>
      <body className={inter.className}>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            {!isLoginPage && <Header />}
            <main
              className={`flex bg-gradient-to-br from-blue-100 to-blue-300 ${
                isLoginPage && "h-full"
              }`}
            >
              {children}
            </main>
            <Notification />
          </AuthProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}

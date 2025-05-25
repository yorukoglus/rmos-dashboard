import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RMOS Dashboard",
  description: "RMOS Dashboard Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="flex bg-gradient-to-br from-blue-100 to-blue-300">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

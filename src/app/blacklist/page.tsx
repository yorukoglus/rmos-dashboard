"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/types/api";
import { api } from "@/utils/api";

interface BlacklistData {
  // API'den dönen veri yapısına göre güncellenecek
  [key: string]: any;
}

export default function BlacklistPage() {
  const { token } = useAuth();
  const [data, setData] = useState<BlacklistData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.get(API_ENDPOINTS.BLACKLIST.GET);
      if (!result || !result.value) {
        throw new Error("API'den geçerli bir yanıt alınamadı");
      }
      setData(result.value);
    } catch (err: any) {
      console.error("API Hatası:", err);
      setError(
        err.message ||
          "Veri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 py-8 px-2 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 rounded-xl shadow-lg p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-6 text-blue-800 tracking-tight">
            Blacklist
          </h1>

          {loading && (
            <div className="text-blue-700 font-semibold">Yükleniyor...</div>
          )}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && data && (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-xs rounded-lg overflow-hidden shadow">
                <thead className="sticky top-0 z-10 bg-blue-600 text-white">
                  <tr>
                    {data[0] &&
                      Object.keys(data[0]).map((key) => (
                        <th
                          key={key}
                          className="border border-blue-200 px-2 py-2 font-semibold text-center whitespace-nowrap"
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr
                      key={i}
                      className={
                        (i % 2 === 0 ? "bg-white" : "bg-blue-50") +
                        " hover:bg-blue-100 transition"
                      }
                    >
                      {Object.values(row).map((val, j) => (
                        <td
                          key={j}
                          className="border border-blue-100 px-2 py-1 text-center whitespace-nowrap"
                        >
                          {typeof val === "number"
                            ? val.toLocaleString("tr-TR")
                            : val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

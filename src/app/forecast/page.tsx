"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/types/api";
import { api } from "@/utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface ForecastData {
  // API'den dönen veri yapısına göre güncellenecek
  [key: string]: any;
}

const defaultParams = {
  db_Id: 9,
  xRez_Sirket: 9,
  xBas_Tar: "2024-06-01",
  xBit_Tar: "2024-06-10",
  xtip: 1,
  kon1: "ALL",
  kon2: "BB",
  xchkFis_Fazla_otel_10: 0,
  bas_Yil: 2022,
  bit_Yil: 2022,
  fisrci_Kapalioda_10: 0,
  xRez_C_W: "C",
  xSistem_Tarihi: "2024-01-01",
  xAlis_Tarihi: "2024-01-01",
  sistem_Bas1: "2020-01-01",
  sistem_Bit1: "2029-01-01",
  pmdahil_10: 0,
  tip_1: "001",
  xFis_Bela_tutar_10: 0,
  trace_Dus_10: 0,
  cev_01: null,
};

type ForecastParams = typeof defaultParams;

export default function ForecastPage() {
  const { token } = useAuth();
  const [data, setData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [params, setParams] = useState<ForecastParams>(defaultParams);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.post(API_ENDPOINTS.FORECAST, {
        ...params,
        xtip: Number(params.xtip),
      });
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
            Forecast
          </h1>
          {/* Filtre Formu */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-4 items-end mb-8 bg-blue-50 rounded-lg p-4 border border-blue-200"
          >
            <div className="flex flex-col min-w-[160px]">
              <label className="block text-xs font-semibold mb-1 text-blue-800">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                name="xBas_Tar"
                value={params.xBas_Tar}
                onChange={handleChange}
                className="border border-blue-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div className="flex flex-col min-w-[160px]">
              <label className="block text-xs font-semibold mb-1 text-blue-800">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                name="xBit_Tar"
                value={params.xBit_Tar}
                onChange={handleChange}
                className="border border-blue-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div className="flex flex-col min-w-[120px]">
              <label className="block text-xs font-semibold mb-1 text-blue-800">
                Oda Tipi
              </label>
              <input
                type="text"
                name="kon1"
                value={params.kon1}
                onChange={handleChange}
                className="border border-blue-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div className="flex flex-col min-w-[120px]">
              <label className="block text-xs font-semibold mb-1 text-blue-800">
                Şirket
              </label>
              <input
                type="text"
                name="xRez_Sirket"
                value={params.xRez_Sirket}
                onChange={handleChange}
                className="border border-blue-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div className="flex flex-col min-w-[100px]">
              <label className="block text-xs font-semibold mb-1 text-blue-800">
                Tip
              </label>
              <select
                name="xtip"
                value={params.xtip}
                onChange={handleChange}
                className="border border-blue-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold text-xs shadow hover:bg-blue-700 transition"
            >
              Getir
            </button>
          </form>

          {loading && (
            <div className="text-blue-700 font-semibold">Yükleniyor...</div>
          )}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && data && (
            <>
              {/* Tablo */}
              <div className="overflow-x-auto mb-10">
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
              {/* Grafik */}
              <div className="w-full h-96 bg-white rounded-xl shadow p-6 border border-blue-100">
                <h2 className="text-lg font-bold mb-2 text-blue-800">
                  Tahmini Gelir ve Diğer Değerler
                </h2>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={Object.keys(data[0] || {})[0]}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      label={{
                        value: "Değer",
                        angle: -90,
                        position: "insideLeft",
                        fontSize: 14,
                      }}
                    />
                    <Tooltip
                      wrapperClassName="!text-xs"
                      contentStyle={{ fontSize: "12px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    {Object.keys(data[0] || {})
                      .filter((k) => typeof data[0][k] === "number")
                      .slice(0, 2)
                      .map((key, index) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          fill={index === 0 ? "#3B82F6" : "#60A5FA"}
                          name={key}
                        />
                      ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

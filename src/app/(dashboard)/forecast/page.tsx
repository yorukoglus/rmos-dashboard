"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/stores/AuthContext";
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
import { toDisplayDate } from "@/utils/utils";
import { useTranslation } from "react-i18next";
import FormField from "@/components/FormField";

interface ApiResponse<T> {
  value: T;
  isSucceded: boolean;
  message?: string;
}

interface ForecastData {
  Tarih: string;
  Oda: number;
  Musteri: number;
  Gelir: number;
  [key: string]: any;
}

const defaultParams = {
  xRez_Sirket: 9,
  xBas_Tar: "2024-06-01",
  xBit_Tar: "2024-06-08",
  xtip: 1,
  kon1: "ALL",
};

type ForecastParams = typeof defaultParams;

export default function ForecastPage() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [data, setData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [params, setParams] = useState<ForecastParams>(defaultParams);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setParams((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.post<ApiResponse<ForecastData[]>>(
        API_ENDPOINTS.FORECAST,
        { ...params, xtip: Number(params.xtip) }
      );
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
  }, [params]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      fetchData();
    },
    [fetchData]
  );

  useEffect(() => {
    if (token) fetchData();
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="max-w-[calc(100vw-47px)] w-full mx-auto m-4">
      <div className="bg-white/90 rounded-xl shadow-lg p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-6 text-blue-800 tracking-tight">
          {t("forecast.title")}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 items-end mb-8 bg-blue-50 rounded-lg p-4 border border-blue-200"
        >
          <FormField
            label={t("forecast.startDate")}
            type="date"
            name="xBas_Tar"
            value={params.xBas_Tar}
            onChange={handleChange}
          />
          <FormField
            label={t("forecast.endDate")}
            type="date"
            name="xBit_Tar"
            value={params.xBit_Tar}
            onChange={handleChange}
          />
          <FormField
            label={t("forecast.roomType")}
            type="text"
            name="kon1"
            value={params.kon1}
            onChange={handleChange}
          />
          <FormField
            label={t("forecast.company")}
            type="text"
            name="xRez_Sirket"
            value={params.xRez_Sirket}
            onChange={handleChange}
          />
          <FormField
            label={t("forecast.type")}
            type="select"
            name="xtip"
            value={params.xtip}
            onChange={handleChange}
            options={[
              { value: 1, label: "1" },
              { value: 2, label: "2" },
            ]}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold text-xs shadow hover:bg-blue-700 transition"
          >
            {t("forecast.getData")}
          </button>
        </form>

        {loading && (
          <div className="flex h-full items-center justify-center gap-2 text-blue-700 font-semibold">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            {t("common.loading")}
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && data && (
          <>
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
                          {typeof val === "number" ? val : toDisplayDate(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-full h-72 bg-white rounded-xl shadow p-6 border border-blue-100">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={(values: ForecastData) =>
                      toDisplayDate(values.Tarih)
                    }
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{
                      value: t("forecast.value"),
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
                        fill={index === 0 ? "#2563eb" : "#3b82f6"}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

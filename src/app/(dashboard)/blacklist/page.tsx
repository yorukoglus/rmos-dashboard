"use client";

import { useEffect, useState, Fragment } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/types/api";
import { api } from "@/utils/api";
import { toDisplayDate } from "@/utils/utils";

interface BlacklistData {
  Ad: string;
  Soyadi: string;
  TCKN: string;
  KimlikNo: string;
  DogumTarihi: string;
  SistemTarihi: string;
  Aciklama: string;
  Grubu: string;
  MilliyetAd: string;
  Milliyet: string;
  Kullanici: string;
  [key: string]: any;
}

const initialForm: Partial<BlacklistData> = {
  Ad: "",
  Soyadi: "",
  TCKN: "",
  KimlikNo: "",
  DogumTarihi: "",
  Aciklama: "",
  Grubu: "Genel",
  MilliyetAd: "",
  Milliyet: "TR",
  Kullanici: "",
};

export default function BlacklistPage() {
  const { token } = useAuth();
  const [data, setData] = useState<BlacklistData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Partial<BlacklistData>>(initialForm);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newRecord, setNewRecord] =
    useState<Partial<BlacklistData>>(initialForm);
  const [addSuccess, setAddSuccess] = useState("");
  const [addError, setAddError] = useState("");

  const fetchData = async (filter: Partial<BlacklistData> = form) => {
    setLoading(true);
    setError("");
    try {
      const result = await api.post(API_ENDPOINTS.BLACKLIST.GET, {
        db_Id: 9,
        Adi: filter.Ad || "ALL?",
        Soyadi: filter.Soyadi || undefined,
        KimlikNo: filter.KimlikNo || undefined,
        TCKN: filter.TCKN || undefined,
        DogumTarihi: filter.DogumTarihi || undefined,
        Tip: 9,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(form);
  };

  const handleClear = () => {
    setForm(initialForm);
    setSuccess("");
    setError("");
    fetchData(initialForm);
  };

  const handleNewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setAddError("");
    setAddSuccess("");
    try {
      const payload = {
        db_Id: 9,
        Id: 0,
        Adi: newRecord.Ad || "",
        Soy: newRecord.Soyadi || "",
        Aciklama: newRecord.Aciklama || "",
        Tcno: newRecord.TCKN || "",
        Kimlik_no: newRecord.KimlikNo || "",
        Dogum_tarihi: newRecord.DogumTarihi || "",
        Sistem_tarihi: new Date().toISOString(),
        Sistem_grubu: newRecord.Sistem_grubu || "",
        Otel_kodu: newRecord.Otel_kodu || "",
        Ulke_xml: newRecord.Ulke_xml || "",
        Acenta: newRecord.Acenta || "",
      };
      const result = await api.post(API_ENDPOINTS.BLACKLIST.ADD, payload);
      if (result?.isSucceded) {
        setAddSuccess("Kayıt başarıyla eklendi.");
        setNewRecord(initialForm);
        fetchData();
        setShowModal(false);
      } else {
        throw new Error(result?.message || "Kayıt eklenemedi.");
      }
    } catch (err: any) {
      setAddError(err.message || "Kayıt eklenirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-[calc(100vh-72px-2rem)] max-w-[calc(100vw-47px)] w-full bg-white/90 rounded-xl shadow-lg p-6 md:p-10 flex flex-col m-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-800 tracking-tight">
        Blacklist
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200"
      >
        <div>
          <label className="block text-xs font-semibold mb-1 text-blue-800">
            Adı
          </label>
          <input
            name="Ad"
            value={form.Ad || ""}
            onChange={handleChange}
            className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-blue-800">
            Soyadı
          </label>
          <input
            name="Soyadi"
            value={form.Soyadi || ""}
            onChange={handleChange}
            className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-blue-800">
            Doğum Tarihi
          </label>
          <input
            name="DogumTarihi"
            type="date"
            value={form.DogumTarihi || ""}
            onChange={handleChange}
            className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-blue-800">
            Kimlik No
          </label>
          <input
            name="KimlikNo"
            value={form.KimlikNo || ""}
            onChange={handleChange}
            className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-blue-800">
            TCKN
          </label>
          <input
            name="TCKN"
            value={form.TCKN || ""}
            onChange={handleChange}
            className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
          />
        </div>
        <div className="md:col-span-3 flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold text-xs shadow hover:bg-blue-700 transition"
          >
            Filtrele
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold text-xs shadow hover:bg-gray-400 transition"
          >
            Temizle
          </button>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold text-xs shadow hover:bg-green-700 transition"
          >
            Yeni Kayıt
          </button>
        </div>
        {success && <div className="text-green-600 col-span-3">{success}</div>}
        {error && <div className="text-red-500 col-span-3">{error}</div>}
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-800">
              Yeni Kayıt Ekle
            </h2>
            <form
              onSubmit={handleAdd}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                name="Ad"
                value={newRecord.Ad || ""}
                onChange={handleNewChange}
                placeholder="Adı"
                className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
                required
              />
              <input
                name="Soyadi"
                value={newRecord.Soyadi || ""}
                onChange={handleNewChange}
                placeholder="Soyadı"
                className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
                required
              />
              <input
                name="TCKN"
                value={newRecord.TCKN || ""}
                onChange={handleNewChange}
                placeholder="TCKN"
                className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
              />
              <input
                name="KimlikNo"
                value={newRecord.KimlikNo || ""}
                onChange={handleNewChange}
                placeholder="Kimlik No"
                className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
              />
              <input
                name="DogumTarihi"
                type="date"
                value={newRecord.DogumTarihi || ""}
                onChange={handleNewChange}
                placeholder="Doğum Tarihi"
                className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
              />
              <textarea
                name="Aciklama"
                value={newRecord.Aciklama || ""}
                onChange={handleNewChange}
                placeholder="Açıklama"
                className="border border-blue-300 rounded px-2 py-1 text-xs w-full col-span-2"
                rows={2}
              />
              <input
                name="Sistem_grubu"
                value={newRecord.Sistem_grubu || ""}
                onChange={handleNewChange}
                placeholder="Sistem Grubu"
                className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
              />
              <input
                name="Otel_kodu"
                value={newRecord.Otel_kodu || ""}
                onChange={handleNewChange}
                placeholder="Otel Kodu"
                className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
              />
              <input
                name="Ulke_xml"
                value={newRecord.Ulke_xml || ""}
                onChange={handleNewChange}
                placeholder="Ülke XML"
                className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
              />
              <input
                name="Acenta"
                value={newRecord.Acenta || ""}
                onChange={handleNewChange}
                placeholder="Acenta"
                className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
              />
              <div className="col-span-2 flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 text-white px-6 py-2 rounded font-semibold text-xs shadow hover:bg-green-700 transition disabled:opacity-50"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold text-xs shadow hover:bg-gray-400 transition"
                >
                  İptal
                </button>
              </div>
              {addSuccess && (
                <div className="text-green-600 col-span-2">{addSuccess}</div>
              )}
              {addError && (
                <div className="text-red-500 col-span-2">{addError}</div>
              )}
            </form>
          </div>
        </div>
      )}

      {!loading && !error && data && (
        <div className="overflow-auto">
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
                    " hover:bg-blue-100 transition cursor-pointer"
                  }
                >
                  {Object.entries(row).map(([key, val], j) => (
                    <td
                      key={j}
                      className={
                        "border border-blue-100 px-2 py-1 text-center whitespace-nowrap" +
                        (key === "Aciklama" ? " max-w-[200px] truncate" : "")
                      }
                      title={
                        key === "Aciklama" && typeof val === "string"
                          ? val
                          : undefined
                      }
                    >
                      {key === "Aciklama" && typeof val === "string" ? (
                        <span className="block truncate max-w-[200px]">
                          {val}
                        </span>
                      ) : (key === "Dogum_tarihi" || key === "Sistem_tarihi") &&
                        typeof val === "string" ? (
                        toDisplayDate(val)
                      ) : typeof val === "number" ? (
                        val.toLocaleString("tr-TR")
                      ) : (
                        val
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

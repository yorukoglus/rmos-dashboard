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
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedRecord, setSelectedRecord] = useState<BlacklistData | null>(
    null
  );
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

  const handleRowClick = (row: BlacklistData) => {
    setSelectedRecord(row);
    setNewRecord({
      Ad: row.Adi || row.Ad,
      Soyadi: row.Soy || row.Soyadi,
      TCKN: row.Tcno || row.TCKN,
      KimlikNo: row.Kimlik_no || row.KimlikNo,
      DogumTarihi: row.Dogum_tarihi
        ? new Date(row.Dogum_tarihi).toISOString().split("T")[0]
        : row.DogumTarihi,
      Aciklama: row.Aciklama,
      Sistem_grubu: row.Sistem_grubu,
      Otel_kodu: row.Otel_kodu,
      Ulke_xml: row.Ulke_xml,
      Acenta: row.Acenta,
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setAddError("");
    setAddSuccess("");
    try {
      const payload = {
        db_Id: 9,
        Id: modalMode === "edit" ? selectedRecord?.Id || 0 : 0,
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
        setAddSuccess(
          modalMode === "edit"
            ? "Kayıt başarıyla güncellendi."
            : "Kayıt başarıyla eklendi."
        );
        fetchData();
        handleModalClose();
      } else {
        throw new Error(result?.message || "İşlem başarısız oldu.");
      }
    } catch (err: any) {
      setAddError(err.message || "İşlem sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalMode("add");
    setSelectedRecord(null);
    setNewRecord(initialForm);
    setAddSuccess("");
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
            onClick={() => {
              setModalMode("add");
              setNewRecord(initialForm);
              setShowModal(true);
            }}
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
              onClick={handleModalClose}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-800">
              {modalMode === "edit" ? "Kayıt Düzenle" : "Yeni Kayıt Ekle"}
            </h2>
            <form
              onSubmit={handleAdd}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Adı</label>
                <input
                  name="Ad"
                  value={newRecord.Ad || ""}
                  onChange={handleNewChange}
                  className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Soyadı</label>
                <input
                  name="Soyadi"
                  value={newRecord.Soyadi || ""}
                  onChange={handleNewChange}
                  className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">TCKN</label>
                <input
                  name="TCKN"
                  value={newRecord.TCKN || ""}
                  onChange={handleNewChange}
                  className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Kimlik No</label>
                <input
                  name="KimlikNo"
                  value={newRecord.KimlikNo || ""}
                  onChange={handleNewChange}
                  className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Doğum Tarihi</label>
                <input
                  name="DogumTarihi"
                  type="date"
                  value={newRecord.DogumTarihi || ""}
                  onChange={handleNewChange}
                  className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
                  required
                />
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-xs text-gray-500">Açıklama</label>
                <textarea
                  name="Aciklama"
                  value={newRecord.Aciklama || ""}
                  onChange={handleNewChange}
                  className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
                  rows={2}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Sistem Grubu</label>
                <input
                  name="Sistem_grubu"
                  value={newRecord.Sistem_grubu || ""}
                  onChange={handleNewChange}
                  className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Otel Kodu</label>
                <input
                  name="Otel_kodu"
                  value={newRecord.Otel_kodu || ""}
                  onChange={handleNewChange}
                  className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Ülke XML</label>
                <input
                  name="Ulke_xml"
                  value={newRecord.Ulke_xml || ""}
                  onChange={handleNewChange}
                  className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Acenta</label>
                <input
                  name="Acenta"
                  value={newRecord.Acenta || ""}
                  onChange={handleNewChange}
                  className="border border-blue-300 rounded px-2 py-1 text-xs w-full"
                />
              </div>
              <div className="col-span-2 flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 text-white px-6 py-2 rounded font-semibold text-xs shadow hover:bg-green-700 transition disabled:opacity-50"
                >
                  {modalMode === "edit" ? "Güncelle" : "Kaydet"}
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
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
      {loading && (
        <div className="flex h-full items-center justify-center gap-2 text-blue-700 font-semibold">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
          Yükleniyor...
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
                  onClick={() => handleRowClick(row)}
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

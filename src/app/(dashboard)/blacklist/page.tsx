"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/types/api";
import { api } from "@/utils/api";
import { toDisplayDate } from "@/utils/utils";
import { useNotificationStore } from "@/stores/notificationStore";
import { useTranslation } from "react-i18next";
import FormField from "@/components/FormField";

interface ApiResponse<T> {
  value: T;
  isSucceded: boolean;
  message?: string;
}

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
  const { success, error: showError } = useNotificationStore();
  const [data, setData] = useState<BlacklistData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Partial<BlacklistData>>(initialForm);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedRecord, setSelectedRecord] = useState<BlacklistData | null>(
    null
  );
  const [newRecord, setNewRecord] =
    useState<Partial<BlacklistData>>(initialForm);
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const { t } = useTranslation();

  const fetchData = useCallback(
    async (params = form) => {
      setLoading(true);
      setError("");
      try {
        const result = await api.post<ApiResponse<BlacklistData[]>>(
          API_ENDPOINTS.BLACKLIST.GET,
          {
            db_Id: 9,
            Adi: params.Ad || "ALL?",
            Soyadi: params.Soyadi || undefined,
            KimlikNo: params.KimlikNo || undefined,
            TCKN: params.TCKN || undefined,
            DogumTarihi: params.DogumTarihi || undefined,
            Tip: 9,
          }
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
    },
    [form]
  );

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      fetchData(form);
    },
    [fetchData, form]
  );

  const handleClear = useCallback(() => {
    setForm(initialForm);
    setError("");
    fetchData(initialForm);
  }, [fetchData]);

  const handleNewChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setNewRecord((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleRowClick = useCallback((row: BlacklistData) => {
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
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
      const result = await api.post<ApiResponse<null>>(
        API_ENDPOINTS.BLACKLIST.ADD,
        payload
      );
      if (result?.isSucceded) {
        success(
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
      showError(err.message || "İşlem sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalMode("add");
    setSelectedRecord(null);
    setNewRecord(initialForm);
  };

  const memoizedForm = useMemo(() => form, [form]);
  const memoizedNewRecord = useMemo(() => newRecord, [newRecord]);

  useEffect(() => {
    if (token) {
      fetchData(initialForm);
    }
  }, [token]);

  return (
    <div className="h-[calc(100vh-72px-2rem)] max-w-[calc(100vw-47px)] w-full bg-white/90 rounded-xl shadow-lg p-6 md:p-10 flex flex-col m-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800 tracking-tight">
          {t("blacklist.title")}
        </h1>
        <button
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <span className="text-sm font-medium">
            {isFilterVisible ? t("common.hideFilter") : t("common.showFilter")}
          </span>
          <svg
            className={`w-4 h-4 transform transition-transform ${
              isFilterVisible ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {isFilterVisible && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200"
        >
          <FormField
            name="Ad"
            value={memoizedForm.Ad || ""}
            onChange={handleChange}
            label="blacklist.name"
          />
          <FormField
            name="Soyadi"
            value={memoizedForm.Soyadi || ""}
            onChange={handleChange}
            label="blacklist.surname"
          />
          <FormField
            name="DogumTarihi"
            value={memoizedForm.DogumTarihi || ""}
            onChange={handleChange}
            label="blacklist.birthDate"
            type="date"
          />
          <FormField
            name="KimlikNo"
            value={memoizedForm.KimlikNo || ""}
            onChange={handleChange}
            label="blacklist.idNumber"
          />
          <FormField
            name="TCKN"
            value={memoizedForm.TCKN || ""}
            onChange={handleChange}
            label="blacklist.TCKN"
          />
          <div className="md:col-span-3 flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold text-xs shadow hover:bg-blue-700 transition"
            >
              {loading ? t("common.loading") : t("common.filter")}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold text-xs shadow hover:bg-gray-400 transition"
            >
              {t("common.clear")}
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
              {t("common.newRecord")}
            </button>
          </div>
          {error && <div className="text-red-500 col-span-3">{error}</div>}
        </form>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-6 right-6 text-gray-500 hover:bg-gray-200 border rounded-md px-1.5"
              onClick={handleModalClose}
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-800">
              {modalMode === "edit" ? "Kayıt Düzenle" : "Yeni Kayıt Ekle"}
            </h2>
            <form
              onSubmit={handleAdd}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <FormField
                name="Ad"
                value={memoizedNewRecord.Ad || ""}
                onChange={handleNewChange}
                label="blacklist.name"
                required
              />
              <FormField
                name="Soyadi"
                value={memoizedNewRecord.Soyadi || ""}
                onChange={handleNewChange}
                label="blacklist.surname"
                required
              />
              <FormField
                name="TCKN"
                value={memoizedNewRecord.TCKN || ""}
                onChange={handleNewChange}
                label="blacklist.TCKN"
              />
              <FormField
                name="KimlikNo"
                value={memoizedNewRecord.KimlikNo || ""}
                onChange={handleNewChange}
                label="blacklist.idNumber"
              />
              <FormField
                name="DogumTarihi"
                value={memoizedNewRecord.DogumTarihi || ""}
                onChange={handleNewChange}
                label="blacklist.birthDate"
                type="date"
                required
              />
              <FormField
                name="Aciklama"
                value={memoizedNewRecord.Aciklama || ""}
                onChange={handleNewChange}
                label="blacklist.description"
                type="textarea"
                rows={3}
              />
              <FormField
                name="Sistem_grubu"
                value={memoizedNewRecord.Sistem_grubu || ""}
                onChange={handleNewChange}
                label="blacklist.systemGroup"
              />
              <FormField
                name="Otel_kodu"
                value={memoizedNewRecord.Otel_kodu || ""}
                onChange={handleNewChange}
                label="blacklist.hotelCode"
              />
              <FormField
                name="Ulke_xml"
                value={memoizedNewRecord.Ulke_xml || ""}
                onChange={handleNewChange}
                label="blacklist.countryXml"
              />
              <FormField
                name="Acenta"
                value={memoizedNewRecord.Acenta || ""}
                onChange={handleNewChange}
                label="blacklist.agency"
              />
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

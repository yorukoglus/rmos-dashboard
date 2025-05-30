"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { API_ENDPOINTS } from "@/types/api";
import { api } from "@/utils/api";
import { toDisplayDate } from "@/utils/utils";
import { useNotificationStore } from "@/stores/notificationStore";
import { useTranslation } from "react-i18next";
import FormField from "@/components/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface ApiResponse<T> {
  value: T;
  isSucceded: boolean;
  message?: string;
}

interface BlacklistData {
  Ad: string;
  Soyadi: string;
  TCKN?: number;
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
  KimlikNo: "",
  DogumTarihi: "",
  Aciklama: "",
  Grubu: "Genel",
  MilliyetAd: "",
  Milliyet: "TR",
  Kullanici: "",
};

const blacklistSchema = z.object({
  Ad: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  Soyadi: z.string().min(2, "Soyadı en az 2 karakter olmalıdır"),
  TCKN: z.number().int().gte(9999999999, "TCKN 11 haneli olmalıdır").optional(),
  KimlikNo: z.string().min(1, "Kimlik numarası gereklidir").optional(),
  DogumTarihi: z.string().min(1, "Doğum tarihi gereklidir"),
  Aciklama: z.string().optional(),
  Sistem_grubu: z.string().optional(),
  Otel_kodu: z.string().optional(),
  Ulke_xml: z.string().optional(),
  Acenta: z.string().optional(),
});

type BlacklistFormData = z.infer<typeof blacklistSchema>;

export default function BlacklistPage() {
  const { success, error: showError } = useNotificationStore();
  const [data, setData] = useState<BlacklistData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedRecord, setSelectedRecord] = useState<BlacklistData | null>(
    null
  );
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const { t } = useTranslation();

  const filterForm = useForm<BlacklistFormData>({
    defaultValues: initialForm,
  });

  const modalForm = useForm<BlacklistFormData>({
    resolver: zodResolver(blacklistSchema),
    defaultValues: initialForm,
  });

  const fetchData = useCallback(async (params = initialForm) => {
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
        throw new Error(t("common.anErrorOccured"));
      }
      setData(result.value);
    } catch (err: any) {
      console.error("API Hatası:", err);
      setError(err.message || t("common.fetchError"));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRowClick = useCallback(
    (row: BlacklistData) => {
      setSelectedRecord(row);
      modalForm.reset({
        Ad: row.Adi || row.Ad,
        Soyadi: row.Soy || row.Soyadi,
        TCKN: Number(row.Tcno || row.TCKN),
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
    },
    [modalForm]
  );

  const handleModalClose = () => {
    setShowModal(false);
    setModalMode("add");
    setSelectedRecord(null);
    modalForm.reset(initialForm);
  };

  const handleAdd = async (formData: BlacklistFormData) => {
    setSaving(true);
    try {
      const payload = {
        db_Id: 9,
        Id: modalMode === "edit" ? selectedRecord?.Id || 0 : 0,
        Adi: formData.Ad || "",
        Soy: formData.Soyadi || "",
        Aciklama: formData.Aciklama || "",
        Tcno: formData.TCKN + "" || "",
        Kimlik_no: formData.KimlikNo || "",
        Dogum_tarihi: formData.DogumTarihi || "",
        Sistem_tarihi: new Date().toISOString(),
        Sistem_grubu: formData.Sistem_grubu || "",
        Otel_kodu: formData.Otel_kodu || "",
        Ulke_xml: formData.Ulke_xml || "",
        Acenta: formData.Acenta || "",
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

  const handleFilterClear = () => {
    filterForm.reset(initialForm);
    fetchData(initialForm);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(filterForm.getValues() as BlacklistFormData);
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200"
        >
          <FormField
            name="Ad"
            value={filterForm.watch("Ad")}
            onChange={(e) => filterForm.setValue("Ad", e.target.value)}
            label={t("blacklist.name")}
          />
          <FormField
            name="Soyadi"
            value={filterForm.watch("Soyadi")}
            onChange={(e) => filterForm.setValue("Soyadi", e.target.value)}
            label={t("blacklist.surname")}
          />
          <FormField
            name="DogumTarihi"
            value={filterForm.watch("DogumTarihi")}
            onChange={(e) => filterForm.setValue("DogumTarihi", e.target.value)}
            label={t("blacklist.birthDate")}
            type="date"
          />
          <FormField
            name="KimlikNo"
            value={filterForm.watch("KimlikNo")}
            onChange={(e) => filterForm.setValue("KimlikNo", e.target.value)}
            label={t("blacklist.idNumber")}
          />
          <FormField
            name="TCKN"
            value={filterForm.watch("TCKN")}
            onChange={(e) =>
              filterForm.setValue("TCKN", Number(e.target.value))
            }
            label={t("blacklist.TCKN")}
            type="number"
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
              onClick={handleFilterClear}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold text-xs shadow hover:bg-gray-400 transition"
            >
              {t("common.clear")}
            </button>
            <button
              type="button"
              onClick={() => {
                setModalMode("add");
                modalForm.reset(initialForm);
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
              onSubmit={modalForm.handleSubmit(handleAdd)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <FormField
                name="Ad"
                value={modalForm.watch("Ad")}
                onChange={(e) => modalForm.setValue("Ad", e.target.value)}
                label={t("blacklist.name")}
                required
                error={modalForm.formState.errors.Ad?.message}
              />
              <FormField
                name="Soyadi"
                value={modalForm.watch("Soyadi")}
                onChange={(e) => modalForm.setValue("Soyadi", e.target.value)}
                label={t("blacklist.surname")}
                required
                error={modalForm.formState.errors.Soyadi?.message}
              />
              <FormField
                name="TCKN"
                value={modalForm.watch("TCKN")}
                onChange={(e) =>
                  modalForm.setValue("TCKN", Number(e.target.value))
                }
                label={t("blacklist.TCKN")}
                error={modalForm.formState.errors.TCKN?.message}
                type="number"
              />
              <FormField
                name="KimlikNo"
                value={modalForm.watch("KimlikNo")}
                onChange={(e) => modalForm.setValue("KimlikNo", e.target.value)}
                label={t("blacklist.idNumber")}
                error={modalForm.formState.errors.KimlikNo?.message}
              />
              <FormField
                name="DogumTarihi"
                value={modalForm.watch("DogumTarihi")}
                onChange={(e) =>
                  modalForm.setValue("DogumTarihi", e.target.value)
                }
                label={t("blacklist.birthDate")}
                type="date"
                required
                error={modalForm.formState.errors.DogumTarihi?.message}
              />
              <FormField
                name="Aciklama"
                value={modalForm.watch("Aciklama")}
                onChange={(e) => modalForm.setValue("Aciklama", e.target.value)}
                label={t("blacklist.description")}
                type="textarea"
                rows={3}
                error={modalForm.formState.errors.Aciklama?.message}
              />
              <FormField
                name="Sistem_grubu"
                value={modalForm.watch("Sistem_grubu")}
                onChange={(e) =>
                  modalForm.setValue("Sistem_grubu", e.target.value)
                }
                label={t("blacklist.systemGroup")}
                error={modalForm.formState.errors.Sistem_grubu?.message}
              />
              <FormField
                name="Otel_kodu"
                value={modalForm.watch("Otel_kodu")}
                onChange={(e) =>
                  modalForm.setValue("Otel_kodu", e.target.value)
                }
                label={t("blacklist.hotelCode")}
                error={modalForm.formState.errors.Otel_kodu?.message}
              />
              <FormField
                name="Ulke_xml"
                value={modalForm.watch("Ulke_xml")}
                onChange={(e) => modalForm.setValue("Ulke_xml", e.target.value)}
                label={t("blacklist.countryXml")}
                error={modalForm.formState.errors.Ulke_xml?.message}
              />
              <FormField
                name="Acenta"
                value={modalForm.watch("Acenta")}
                onChange={(e) => modalForm.setValue("Acenta", e.target.value)}
                label={t("blacklist.agency")}
                error={modalForm.formState.errors.Acenta?.message}
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

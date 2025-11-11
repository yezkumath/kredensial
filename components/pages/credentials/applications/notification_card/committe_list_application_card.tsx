"use client";
import { ApplicationCard } from "@/connection/interface";
import { GET_committe_list_application_card } from "@/connection/credentials/application";
import { useEffect } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import Card_Application from "../card_status";
import { SetCookieAccessAs } from "@/function/cookie/access";
// Fetcher function standar untuk SWR

export default function Page() {
  // Use SWR with the function fetcher
  const { data, error, isLoading } = useSWR<ApplicationCard[]>(
    `GET_committe_list_application_card`,
    async () => {
      try {
        const result = await GET_committe_list_application_card();
        // Return empty array if result is null, ensuring type compatibility
        return result ?? [];
      } catch (err) {
        console.error("Error fetching data:", err);
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  // Data yang akan digunakan: array kosong jika loading/error
  const detilDocument = data || []; // Jika data adalah null atau undefined, gunakan array kosong

  // Tampilkan toast error jika fetch gagal
  useEffect(() => {
    if (error) {
      console.error("SWR Fetch Error:", error);
      toast.error("Gagal mengambil data Dokumen Kewenangan Klinis");
    }
  }, [error]);

  const handleCardClick = async () => {
    await SetCookieAccessAs(1);
  };
  // --- Penanganan State ---

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="w-screen max-w-full mx-auto p-4 flex justify-center py-12">
        <div className="text-blue-500 font-bold">Memuat Data...</div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="w-screen max-w-full mx-auto p-4 text-center text-red-500">
        Terjadi Kesalahan Saat Memuat Data. Silakan coba lagi.
      </div>
    );
  }

  // 3. Data Kosong State (Berhasil Fetch, Tapi Array Kosong)
  // Periksa apakah 'data' ada dan panjang array-nya 0
  if (data && data.length === 0) {
    return (
      <div className="w-screen max-w-full mx-auto p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
        Anda tidak memiliki Aplikasi PK yang harus diproses.
      </div>
    );
  }

  // 4. Success State (Data Tersedia)
  return (
    <div className="w-screen max-w-full mx-auto p-4">
      {/* Meneruskan data yang sudah di-fetch ke Card_Application */}
      <Card_Application
        detilDocument={detilDocument}
        onCardClick={handleCardClick}
      />
    </div>
  );
}

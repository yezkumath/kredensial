"use client";
import useSWR, { SWRConfiguration } from "swr";
import toast from "react-hot-toast";
import {
  GET_category_and_document_logbook,
  GET_category_logbook,
} from "@/connection/log_book";
import { LogBookCategory, CategoryLogbook } from "@/connection/interface";
import Log_Book_Category_Detail from "@/components/pages/log_book/manage_category_log_book";

export default function Page() {
  const defaultSWRConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    fallbackData: [], // use empty array for initial safe value
  };

  // --- 1. Fetch Data Detail Category LogBook ---
  const {
    data: data_category_logbook,
    error: error_category_logbook,
    isLoading: isLoading_category_logbook,
    mutate: mutate_category_logbook,
  } = useSWR<LogBookCategory[] | null, Error>(
    `GET_category_and_document_logbook`, // unique key
    async () => {
      try {
        const result = await GET_category_and_document_logbook();
        return result;
      } catch (err) {
        console.error(
          "Error fetching category and document logbook data:",
          err
        );
        throw err;
      }
    },
    defaultSWRConfig
  );

  // --- 2. Fetch Data Ketrampilan Klinis ---
  const {
    data: data_ketrampilan_klinis,
    error: error_ketrampilan_klinis,
    isLoading: isLoading_ketrampilan_klinis,
  } = useSWR<CategoryLogbook[] | null, Error>(
    `GET_category_logbook`, // unique key
    async () => {
      try {
        const result = await GET_category_logbook();
        return result;
      } catch (err) {
        console.error("Error fetching category logbook data:", err);
        throw err;
      }
    },
    defaultSWRConfig
  );

  if (isLoading_category_logbook || isLoading_ketrampilan_klinis) {
    return (
      <div className="flex items-center justify-center">
        <img src="/images/loading.gif" alt="Loading..." />
      </div>
    );
  } else if (error_category_logbook || error_ketrampilan_klinis) {
    console.error(
      "SWR Fetch Error:",
      error_category_logbook || error_ketrampilan_klinis
    );
    if (error_category_logbook) {
      toast.error("Gagal mengambil data Kategori Log Book");
    }
    if (error_ketrampilan_klinis) {
      toast.error("Gagal mengambil data Ketrampilan Klinis");
    }
    return null;
  } else {
    return (
      <div>
        <Log_Book_Category_Detail
          data_detail_category_logbook={data_category_logbook ?? []}
          data_detail_category_logbookMutate={mutate_category_logbook}
          data_category_logbook={data_ketrampilan_klinis ?? []}
        />
      </div>
    );
  }
}

"use client";
import useSWR, { SWRConfiguration } from "swr";
import toast from "react-hot-toast";
import { GET_category_logbook } from "@/connection/log_book";
import { CategoryLogbook } from "@/connection/interface";
import ManageSkillLogBook from "@/components/pages/log_book/manage_skill";

export default function Page() {
  const defaultSWRConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    fallbackData: [], // use empty array for initial safe value
  };

  // --- 1. Fetch Data  Category LogBook ---
  const { data, error, isLoading, mutate } = useSWR<
    CategoryLogbook[] | null,
    Error
  >(
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <img src="/images/loading.gif" alt="Loading..." />
      </div>
    );
  } else if (error) {
    console.error("SWR Fetch Error:", error);
    toast.error("Gagal mengambil data Kategori Log Book");
  } else {
    return (
      <ManageSkillLogBook
        data_category_logbook={data || []}
        mutate_category_logbook={mutate}
      />
    );
  }
}

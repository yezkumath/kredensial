"use client";
import useSWR, { SWRConfiguration } from "swr";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import { GetCookieDocumentLogBook } from "@/function/cookie/logBook";
import { GetLoginCookie } from "@/function/cookie/loginData";
import { GET_logbook_detail } from "@/connection/log_book";
import { LogBookDetail } from "@/connection/interface";
import Log_Book_Detail from "@/components/pages/log_book/log_book_detail";
import { GetCookieMedicalPersonal } from "@/function/cookie/medicalPersonnel";

export default function Page() {
  const [nip, setNip] = useState("");
  const [id_document, setId_document] = useState(-1);
  useEffect(() => {
    getInitial_Data();
  }, []);

  const getInitial_Data = async () => {
    let nip: string | null = await GetCookieMedicalPersonal();

    const id = await GetCookieDocumentLogBook();
    setId_document(id ?? -1);
    if (!nip) {
      const loginData = await GetLoginCookie();
      nip = loginData?.nip;
    }
    if (nip) {
      setNip(nip);
      console.log("nip:", nip);
    }
  };

  const defaultSWRConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    fallbackData: [], // use empty array for initial safe value
  };

  // --- 1. Fetch Data Detail LogBook ---
  const { data, error, isLoading, mutate } = useSWR<
    LogBookDetail[] | null,
    Error
  >(
    nip && id_document ? `GET_logbook_detail-${id_document}-${nip}` : null, // uniq key

    async () => {
      if (!nip || !id_document) return null;
      try {
        const result = await GET_logbook_detail(id_document, nip);
        return result;
      } catch (err) {
        console.error("Error fetching employee data:", err);
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
    toast.error("Error fetching log book detail data.");
    return null;
  } else {
    return (
      <div>
        <Log_Book_Detail
          data_logbook={data ?? []}
          data_logbookMutate={async () => await mutate()}
        />
      </div>
    );
  }
}

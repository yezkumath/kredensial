"use client";
import useSWR, { SWRConfiguration } from "swr";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import { GET_logbook_each_document } from "@/connection/log_book";
import { LogBook } from "@/connection/interface";
import {
  GetCookieLogBook,
  ResetCookieDocumentLogBook,
} from "@/function/cookie/logBook";
import { GetLoginCookie } from "@/function/cookie/loginData";
import Log_Book from "@/components/pages/log_book/log_book";
import { SetCookieAccessAs } from "@/function/cookie/access";
import { SetCookieMedicalPersonal } from "@/function/cookie/medicalPersonnel";

export default function Page() {
  const [nip, setNip] = useState("");

  useEffect(() => {
    SetCookieAccessAs(5);
    getNip();
  }, []);

  const getNip = async () => {
    let nip: string = "";
    await ResetCookieDocumentLogBook();
    if (nip === "") {
      const loginData = await GetLoginCookie();
      nip = loginData?.nip;
      await SetCookieMedicalPersonal(nip);
    }
    if (nip) {
      setNip(nip);
    }
  };

  const defaultSWRConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    fallbackData: [], // Menggunakan array kosong sebagai nilai awal yang aman
  };

  // --- 1. Fetch Data LogBook Document ---
  const { data, error, isLoading } = useSWR<LogBook[] | null, Error>(
    nip ? `GET_logbook_each_document-${nip}` : null, // Key unik untuk Karyawan
    async () => {
      try {
        const result = await GET_logbook_each_document(nip);
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
    toast.error("Gagal mengambil data Document di Log-Book");
    return null;
  } else {
    console.log(`nip : ${nip}, data: ${data}`);
    return (
      <div>
        <Log_Book data={data ?? []} />
      </div>
    );
  }
}

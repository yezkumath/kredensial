"use client";
import useSWR, { SWRConfiguration } from "swr";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import Log_Book_Detail from "@/components/pages/log_book/log_book_detail";
import { GET_logbook_detail } from "@/connection/log_book";
import { GetCookieApplication } from "@/function/cookie/credential";
import { GetCookieCredential } from "@/function/cookie/credential"; // optional

import { GET_DETAIL_credential_application } from "@/connection/credentials/application";
import { ApplicationDetail, LogBookDetail } from "@/connection/interface";

export default function Page() {
  const [nip, setNip] = useState("");
  const [id_document, setId_document] = useState(-1);
  const [id_application, setId_application] = useState(-1);

  useEffect(() => {
    access();
  }, []);

  useEffect(() => {
    if (id_document !== -1) {
    }
  }, [id_document]);

  const access = async () => {
    const credential = await GetCookieCredential();
    const applicatiom = await GetCookieApplication();
    setId_document(credential ?? -1);
    setId_application(applicatiom);
    //  isNakes 5;
    //  isSupervisor  4;
  };

  const defaultSWRConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    fallbackData: [], // use empty array for data initial
  };

  // --- 1. Fetch Data Application Detail ---
  const {
    data: dataApplication,
    error: errorApplication,
    isLoading: isLoadingApplication,
  } = useSWR<ApplicationDetail | null, Error>(
    id_application
      ? `GET_DETAIL_credential_application-${id_application}`
      : null,
    async () => {
      try {
        const result = await GET_DETAIL_credential_application(id_application);
        return result?.[0] ?? null;
      } catch (err) {
        console.error("Error fetching employee data:", err);
        throw err;
      }
    },
    defaultSWRConfig
  );

  // --- 2. Fetch Data Logbook Detail ---
  const {
    data: dataLogbook,
    error: errorLogbook,
    isLoading: isLoadingLogbook,
  } = useSWR<LogBookDetail[] | null, Error>(
    nip
      ? id_document
        ? `GET_logbook_detail-${id_document}-${nip}`
        : null
      : null, // unique key
    async () => {
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

  useEffect(() => {
    if (dataApplication) {
      setId_document(dataApplication?.id_document);
      setNip(dataApplication?.create_nip);
    }
  }, [dataApplication]);

  if (isLoadingLogbook || isLoadingApplication) {
    return (
      <div className="flex items-center justify-center">
        <img src="/images/loading.gif" alt="Loading..." />
      </div>
    );
  } else if (errorApplication) {
    toast.error("Gagal memuat data detail aplikasi kredensial.");
    return <div>Error loading data.</div>;
  } else if (errorLogbook) {
    toast.error("Gagal memuat data detail Logbook.");
    return <div>Error loading data.</div>;
  } else if (dataLogbook) {
    return (
      <div>
        <Log_Book_Detail
          data_logbook={dataLogbook ?? []}
          data_logbookMutate={async () => undefined}
        />
      </div>
    );
  } else {
    return null;
  }
}

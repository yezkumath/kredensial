"use client";
import toast from "react-hot-toast";
import useSWR, { SWRConfiguration } from "swr";
import { useEffect, useState } from "react";

import Review_Application from "@/components/pages/credentials/applications/application_review";
import { GetCookieAccessAs } from "@/function/cookie/access";
import { GetCookieApplication } from "@/function/cookie/credential";
import { GET_DETAIL_credential_application } from "@/connection/credentials/application";
import { ApplicationDetail } from "@/connection/interface";
export default function Page() {
  const [id_application, SetId_application] = useState(-1);
  const [idAccess, setIdAccess] = useState(-1);

  useEffect(() => {
    getId_application();
    getAccess();
  }, []);

  const getId_application = async () => {
    const id = await GetCookieApplication();
    SetId_application(id);
  };

  const getAccess = async () => {
    const access_id = await GetCookieAccessAs();
    setIdAccess(Number(access_id));
  };
  //  isNakes 5;
  //  isSupervisor  4;
  //  isHead_of_Installation  3;
  //  isMitraBersari 2;
  //  isCommitte 1;

  const defaultSWRConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    //fallbackData: [], // use empty array for data initial
  };

  // --- 1. Fetch Data Application Detail ---
  const { data, error, isLoading, mutate } = useSWR<
    ApplicationDetail | null,
    Error
  >(
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <img src="/images/loading.gif" alt="Loading..." />
      </div>
    );
  } else if (error) {
    toast.error("Gagal memuat data detail aplikasi kredensial.");
    return <div>Error loading data.</div>;
  } else {
    return (
      <Review_Application
        appDetail={data}
        mutateAppDetail={mutate}
        idAccess={idAccess}
      />
    );
  }
}

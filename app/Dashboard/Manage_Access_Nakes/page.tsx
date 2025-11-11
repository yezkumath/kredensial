"use client";
import useSWR, { SWRConfiguration } from "swr";
import ManageAccessNakes from "@/components/pages/nakes/manageAccessNakes";
import toast from "react-hot-toast";

import { Access, EmployeesData, AccessList } from "@/connection/interface";
import {
  GET_access_list,
  GET_credential_access_list,
} from "@/connection/access";
import { GET_data_employee } from "@/connection/employee";

export default function Page() {
  const defaultSWRConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    fallbackData: [], // Menggunakan array kosong sebagai nilai awal yang aman
  };

  // --- 1. Fetch Data Nakes (EmployeesData) ---
  const {
    data: dataNakes,
    error: dataNakesError,
    isLoading: isLoadingDataNakes,
  } = useSWR<EmployeesData[] | null, Error>( // [PERBAIKAN] Tambahkan '| null' dan tipe Error
    "GET_data_employee", // Key unik untuk Karyawan
    async () => {
      try {
        const result = await GET_data_employee();
        return result;
      } catch (err) {
        console.error("Error fetching employee data:", err);
        throw err;
      }
    },
    defaultSWRConfig
  );

  // --- 2. Fetch Detail Data Akses (Access) ---
  const {
    data: accessData,
    error: accessError,
    isLoading: isAccessLoading,
    mutate: accessMutate,
  } = useSWR<Access[] | null, Error>( // [PERBAIKAN] Tambahkan '| null' dan tipe Error
    "GET_access_list", // Key unik untuk Akses
    async () => {
      try {
        const result = await GET_access_list();
        return result;
      } catch (err) {
        console.error("Error fetching view detail access list:", err);
        throw err;
      }
    },
    defaultSWRConfig
  );

  // --- 3. Fetch  Access ---
  const {
    data: dataAccessList,
    error: accessErrorList,
    isLoading: isLoadingAccessList,
  } = useSWR<AccessList[] | null, Error>( // [PERBAIKAN] Tambahkan '| null' dan tipe Error
    "GET_credential_access_list", // Key unik untuk Akses
    async () => {
      try {
        const result = await GET_credential_access_list();
        return result;
      } catch (err) {
        console.error("Error fetching access list:", err);
        throw err;
      }
    },
    defaultSWRConfig
  );
  if (isLoadingDataNakes || isAccessLoading || isLoadingAccessList) {
    return (
      <div className="flex items-center justify-center">
        <img src="/images/loading.gif" alt="Loading..." />
      </div>
    );
  } else if (dataNakesError) {
    console.error("SWR Fetch Error:", dataNakesError);
    toast.error("Gagal mengambil data Tenaga Kesehatan");
    return null;
  } else if (accessError) {
    console.error("SWR Fetch Error:", accessError);
    toast.error("Gagal mengambil data Akses");
    return null;
  } else if (accessErrorList) {
    console.error("SWR Fetch Error:", accessErrorList);
    toast.error("Gagal mengambil data Daftar Akses");
    return null;
  } else {
    return (
      <ManageAccessNakes
        dataNakes={dataNakes ?? []}
        accessData={accessData ?? []}
        dataAccessList={dataAccessList ?? []}
        accessMutate={accessMutate}
      />
    );
  }
}

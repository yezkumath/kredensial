"use client";
import useSWR, { SWRConfiguration } from "swr";
import { GET_data_employee_perawat } from "@/connection/employee";
import { EmployeesData, AccessData } from "@/connection/interface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  SetCookieLogBook,
  ResetCookieLogBook,
} from "@/function/cookie/logBook";
import {
  SetCookieMedicalPersonal,
  ResetCookieMedicalPersonal,
} from "@/function/cookie/medicalPersonnel";

import {
  GetAccessCookie,
  SetCookieAccessAs,
  ResetCookieAccessAs,
} from "@/function/cookie/access";

export default function Page({ redirecPage }: { redirecPage: string }) {
  const router = useRouter();
  const [accessAs, setAccessAs] = useState("");
  const [access, setAccess] = useState<
    { access: number; access_name: string }[]
  >([]);

  const defaultSWRConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    fallbackData: [], // use empty array for data initial
  };

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15); // Default rows per page

  useEffect(() => {
    resetCookie();
    getAccessFromCookie();
  }, []);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const resetCookie = async () => {
    await ResetCookieAccessAs();
    await ResetCookieLogBook();
    await ResetCookieMedicalPersonal();
  };

  const getAccessFromCookie = async () => {
    const accessCookie = await GetAccessCookie();
    if (accessCookie && accessCookie.length > 0) {
      setAccess(accessCookie);
      setAccessAs(accessCookie[0].access.toString());
    }
  };

  // --- 1. Fetch Data List of Employee---
  const { data, error, isLoading, mutate } = useSWR<EmployeesData[], Error>(
    `GET_data_employee_perawat`,
    async () => {
      try {
        const result = await GET_data_employee_perawat();
        return result ?? [];
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
  }

  if (error) {
    toast.error("Gagal memuat data employee Perawat.");
    return <div>Error loading data.</div>;
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  // Filter the detailList by searchTerm (case-insensitive)
  const filteredDetailList = data.filter((detail) => {
    return (
      detail.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.profesi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredDetailList.length / rowsPerPage);

  // Get current page rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentDetailList = filteredDetailList.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const handleClick = async (nip: string, nama: string) => {
    if (redirecPage === "Log_Book") {
      await SetCookieLogBook(nip);
      await SetCookieAccessAs(Number(accessAs));
      await SetCookieMedicalPersonal(nip);
      router.push("/Dashboard/List_Log_Book/Log_Book"); // not yet stables
    } else if (redirecPage === "Detail_Nakes") {
      await SetCookieMedicalPersonal(nip);
      await SetCookieAccessAs(Number(accessAs));
      router.push("/Dashboard/List_Data_Nakes/Detail_Nakes");
    } else {
      null;
    }
  };

  return (
    <div className="w-screen max-w-full mx-auto p-4">
      <Tabs
        value={accessAs}
        onValueChange={(value) => setAccessAs(value)}
        className="mb-5 mx-28"
      >
        <span className=" text-center font-semibold text-green-500 text-2xl">
          MASUK SEBAGAI
        </span>

        <TabsList className="w-full space-x-2 ">
          {access.map((acc) => (
            <TabsTrigger
              key={acc.access}
              value={acc.access.toString()}
              className="data-[state=active]:bg-green-300 "
            >
              {acc.access_name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <Input
            type="text"
            placeholder="Cari berdasarkan nama, NIP, atau bagian..."
            className="pl-10 border-blue-700 border-2 text-4xl h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Rows per page selector */}
        <div className="flex items-center space-x-2 text-sm">
          <p>Jumlah Maksimal baris dalam 1 halaman</p>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20 h-7 border-blue-700 border-2">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="45">45</SelectItem>
              <SelectItem value="90">90</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        {currentDetailList.length > 0 ? (
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold text-xl w-16">No.</TableHead>
                <TableHead className="font-bold text-xl">NIP</TableHead>
                <TableHead className="font-bold text-xl">Nama</TableHead>
                <TableHead className="font-bold text-xl">Unit</TableHead>
                <TableHead className="font-bold text-xl">Profesi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDetailList.map((detail, i) => (
                <TableRow
                  key={i}
                  onClick={() => handleClick(detail.nip, detail.nama)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell className="text-lg">
                    {indexOfFirstRow + i + 1}
                  </TableCell>
                  <TableCell className="text-lg">{detail.nip}</TableCell>
                  <TableCell className="text-lg">{detail.nama}</TableCell>
                  <TableCell className="text-lg">{detail.unit}</TableCell>
                  <TableCell className="text-lg">{detail.profesi}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            {searchTerm
              ? "Tidak ada data yang sesuai dengan pencarian"
              : "Tidak ada data"}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {totalPages <= 7 ? (
              // Show all pages if total pages are 7 or less
              [...Array(totalPages)].map((_, page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page + 1)}
                    isActive={currentPage === page + 1}
                  >
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              ))
            ) : (
              // Show limited pages with ellipsis for large page counts
              <>
                {/* First page */}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(1)}
                    isActive={currentPage === 1}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>

                {/* Ellipsis or page before current */}
                {currentPage > 3 && (
                  <PaginationItem>
                    <PaginationLink className="cursor-default">
                      ...
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Pages around current */}
                {[...Array(5)]
                  .map((_, i) => {
                    const pageNum = Math.max(2, currentPage - 2) + i;
                    if (pageNum > 1 && pageNum < totalPages) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })
                  .filter(Boolean)}

                {/* Ellipsis or page after current */}
                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationLink className="cursor-default">
                      ...
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Last page */}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(totalPages)}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

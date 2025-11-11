"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Search,
  Trash2,
  TableOfContents,
  ArrowRightToLine,
} from "lucide-react";
import useSWR, { SWRConfiguration } from "swr";

import {
  GET_credential_document_card,
  PUT_credential_document_activation,
  DELETE_credential_document,
  GET_credential_document_use,
} from "@/connection/credentials/document";
import { DocumentCredential } from "@/connection/interface";
import Dialog_InputEdit_Document from "./input-edit_Document";
import { SetCookieCedential } from "@/function/cookie/credential";
import { toDBTime } from "@/function/dateTime";

export default function Page({ redirecPage }: { redirecPage: string }) {
  const router = useRouter();

  //DELETE STATE
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] =
    useState<DocumentCredential | null>(null);
  const [totalDocumentUse, setTotalDocumentUse] = useState(-1);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  //Filter state
  const [filterKewenanganKlinis, setFilterKewenanganKlinis] =
    useState<string>("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15); // Default cards per page

  const defaultSWRConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    fallbackData: [], // use empty array for data initial
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterKewenanganKlinis]);

  // --- 1. Fetch Data List of Document Credential---
  const { data, error, isLoading, mutate } = useSWR<
    DocumentCredential[],
    Error
  >(
    `GET_credential_document_card`,
    async () => {
      try {
        const result = await GET_credential_document_card();
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
    toast.error("Gagal memuat data detail Dokumen kredensial.");
    return <div>Error loading data.</div>;
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  // Filter the detailList by searchTerm (case-insensitive)
  const filteredDetailList = data.filter((detail) => {
    const matchesSearch =
      detail.name_document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.short_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.pk_grade.toLowerCase().includes(searchTerm.toLowerCase());
    //|| detail.status.toString.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterKewenanganKlinis === "all" ||
      detail.pk_grade === filterKewenanganKlinis;

    //supper admin (roles = 0) can see status "0" else will exclude status "0" and just show "1"
    const matchesRoleStatus =
      redirecPage === "Input_Document" || detail.status === 1;

    return matchesSearch && matchesFilter && matchesRoleStatus;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredDetailList.length / rowsPerPage);

  // Get current page cards
  const indexOfLastCard = currentPage * rowsPerPage;
  const indexOfFirstCard = indexOfLastCard - rowsPerPage;
  const currentDetailList = filteredDetailList.slice(
    indexOfFirstCard,
    indexOfLastCard
  );

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // Reset to first page when search term changes

  //FUNCTION HANDLERS
  const handleClick = (id: number) => {
    SetCookieCedential(id);
    console.log("Click", redirecPage);
    if (redirecPage === "Input_Document") {
      router.push("/Dashboard/Manage_Kredensial/Input_Pertanyaan");
    } else if (redirecPage === "Pengajuan_Kredensial") {
      router.push("/Dashboard/Aplikasi_Kredensial/Pengajuan_Kredensial");
    } else {
      null;
    }
  };

  // const setDateUpdate = async (id: number, dateCreate: Date) => {
  //   const result = await getLastUpdateDate(id);
  //   if (result && result.length > 0) {
  //     setUpdateDate(new Date(result[0]));
  //   } else {
  //     setUpdateDate(dateCreate);
  //   }
  // };

  const handleCheckboxChange = async (id: number, checked: number) => {
    // User clicks checkbox
    // ↓
    // 1. optimisticData shows immediately (UI updates instantly)
    // ↓
    // 2. Database update runs in background
    // ↓
    // 3a. SUCCESS → Keep optimistic data
    // 3b. ERROR → Auto-rollback to previous data

    // Prepare optimistic data
    const optimisticData = data.map((detail) =>
      detail.id === id ? { ...detail, status: checked } : detail
    );

    try {
      // Optimistic update with automatic rollback
      await mutate(
        // Database update function
        async () => {
          const result = await PUT_credential_document_activation(id, checked);

          if (!result) {
            throw new Error("Database update failed");
          }

          // Return the updated data
          return optimisticData;
        },
        // SWR options
        {
          optimisticData, // Show this immediately
          rollbackOnError: true, // Auto-revert on error
          populateCache: true, // Update cache
          revalidate: false, // Don't refetch (we already have new data)
        }
      );

      toast.success(
        `Document ${checked === 1 ? "activated" : "deactivated"} successfully!`
      );
    } catch (error) {
      console.error("Error in handleCheckboxChange:", error);
      toast.error("Gagal mengaktifkan dan deaktifkan dokumen");
    }
  };

  const handleDelete = async () => {
    if (!selectedDetail) {
      toast.error("Data yang ingin di Hapus tidak ditemukan");
      return;
    }
    // try {
    //   const result = await DeleteDocument(selectedDetail.id, nip);
    //   if (result) {
    //     await fetchData();
    //     toast.remove("Dokumen berhasil di Hapus!");
    //   }
    //   await mutate();
    //   setIsDialogOpen(false);
    // } catch (error) {
    //   console.error("Error in handleEdit:", error);
    //   toast.error("Gagal memperbarui dokumen");
    // }
    // Optimistic data (remove item immediately)

    const optimisticData = data.filter((item) => item.id !== selectedDetail.id);

    try {
      await mutate(
        async () => {
          // Call your DELETE API
          const result = await DELETE_credential_document(selectedDetail.id);

          if (!result) throw new Error("Delete failed");

          return optimisticData;
        },
        {
          optimisticData, // Show immediately (item removed)
          rollbackOnError: true, // Auto-restore on error
          populateCache: true,
          revalidate: false,
        }
      );

      toast.success("Document deleted successfully!");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete document");
    }
  };

  const handleTrashClick = async (
    e: React.MouseEvent,
    detail: DocumentCredential
  ) => {
    e.stopPropagation(); // Prevent card click
    e.preventDefault(); // Additional prevention
    setSelectedDetail(detail);

    setIsDialogOpen(true);
    try {
      const response = await GET_credential_document_use(detail.id);
      if (response) {
        setTotalDocumentUse(Number(response[0].total));
      }
    } catch (error) {
      console.error("Error get documentUse:", error);
      toast.error("Failed to get documentUse");
    }
  };

  return (
    <div className="w-screen max-w-full mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <Input
            type="text"
            placeholder="Cari nama Kewenangan Klinis Dokumen..."
            className="pl-10 border-blue-700 border-2 text-4xl h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Select Category */}
        <div className="flex items-center space-x-2 text-sm">
          <p>Kategori</p>
          <Select
            value={filterKewenanganKlinis}
            onValueChange={(value) => setFilterKewenanganKlinis(value)}
          >
            <SelectTrigger
              className="w-72 h-7 border-blue-700 border-2"
              id="filter-kewenangan"
            >
              <SelectValue placeholder="Semua Kewenangan Klinis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kewenangan Klinis</SelectItem>
              <SelectItem value="Kewenangan Klinis 1">
                Kewenangan Klinis 1
              </SelectItem>
              <SelectItem value="Kewenangan Klinis 2">
                Kewenangan Klinis 2
              </SelectItem>
              <SelectItem value="Kewenangan Klinis 3">
                Kewenangan Klinis 3
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Cards per page selector */}
        <div className="flex items-center space-x-2 text-sm">
          <p>Jumlah Maksimal kartu dalam 1 halaman</p>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20 h-7 border-blue-700 border-2">
              <SelectValue placeholder="Cards" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="45">45</SelectItem>
              <SelectItem value="90">90</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="mb-6">
        {currentDetailList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentDetailList.map((detail, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-blue-50/75"
              >
                {/* Card Content */}
                <div className="space-y-2">
                  {/* Name */}
                  <h3
                    className={`flex justify-between items-center font-semibold text-lg rounded-2xl text-white px-4 truncate 
                           ${
                             detail.status === 1
                               ? "bg-blue-500"
                               : "bg-amber-500"
                           }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {detail.short_name}
                    {redirecPage === "Input_Document" && (
                      <Checkbox
                        checked={detail.status === 1}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(detail.id, checked ? 1 : 0)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-white data-[state=checked]:text-blue-500 data-[state=checked]:border-blue-500 border-2 font-extrabold [&>svg]:stroke-[8] [&>svg]:stroke-blue-500"
                      />
                    )}
                  </h3>

                  {/* Jenis PK */}
                  <div className="flex  flex-row items-center text-sm text-gray-600 font-semibold">
                    <span className="text-gray-800 basis-11/12">
                      {detail.pk_grade}
                    </span>
                  </div>

                  {/* Nama Lengkap */}
                  <div className="flex items-center text-xs text-gray-600 max-w-full">
                    <span className="text-gray-800 truncate">
                      {detail.name_document}
                    </span>
                  </div>

                  {/* Last Update */}
                  <div className="flex items-center text-sm justify-between  text-yellow-400">
                    <div>
                      <span className="font-medium mr-2  text-blue-400">
                        Update Pada:
                      </span>
                      <span className="font-medium truncate  text-blue-400">
                        {detail.update_date
                          ? toDBTime(detail.update_date)
                          : toDBTime(detail.create_date)}
                      </span>
                    </div>
                  </div>
                  {redirecPage === "Input_Document" && (
                    <div className="flex items-center text-sm justify-between ">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className=" bg-transparent text-blue-400 hover:bg-blue-500 hover:text-white shadow-xl transition-colors w-24"
                            onClick={() => handleClick(detail.id)}
                          >
                            <TableOfContents
                              strokeWidth={3}
                              className="h-5 w-5"
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="center">
                          Manajemen Pertanyaan
                        </TooltipContent>
                      </Tooltip>

                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                      >
                        <Dialog_InputEdit_Document
                          onSuccess={mutate}
                          isInput={false}
                          edit={detail}
                        />
                      </div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={(e) => handleTrashClick(e, detail)}
                            className=" bg-transparent text-red-400 hover:bg-red-500 hover:text-white shadow-xl transition-colors  w-24"
                          >
                            <Trash2 className="h-5 w-5" strokeWidth={3} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="center">
                          Hapus Document
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                  {redirecPage === "Pengajuan_Kredensial" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className=" bg-transparent text-blue-400 hover:bg-blue-500 hover:text-white shadow-xl transition-colors w-24"
                          onClick={() => handleClick(detail.id)}
                        >
                          <ArrowRightToLine
                            strokeWidth={3}
                            className="h-5 w-5"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="center">
                        Ajukan Kredensial
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className=" md:min-w-[50%]">
          <DialogHeader>
            <DialogTitle className="text-center font-bold mb-5 text-2xl">
              Konfirmasi Hapus
            </DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <p>
              Dokumen ini digunakan oleh {totalDocumentUse} Aplikasi Kredensial
            </p>
            {totalDocumentUse > 0 && (
              <p className="text-red-400">Dokumen ini tidak bisa dihapus !!!</p>
            )}
          </div>
          <div className="space-x-5 text-center">
            <Button
              className="bg-green-500 w-56"
              disabled={totalDocumentUse > 0}
            >
              Hapus
            </Button>
            <DialogClose asChild>
              <Button variant={"destructive"} className="w-56">
                Batal
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

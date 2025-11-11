"use client";
import { ApplicationCard } from "@/connection/interface";
import { useEffect, useState } from "react";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  SetCookieApplication,
  SetCookieCedential,
} from "@/function/cookie/credential";
import { SetCookieMedicalPersonal } from "@/function/cookie/medicalPersonnel";
import { toDBTime } from "@/function/dateTime";

export default function Page({
  detilDocument,
  onCardClick,
}: {
  detilDocument: ApplicationCard[];
  onCardClick?: () => void | Promise<void>;
}) {
  const router = useRouter();
  useState<ApplicationCard | null>(null);

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return {
          bg: "bg-gray-500 hover:bg-gray-700",
          border: "border-gray-500",
          text: "text-gray-500",
        };
      case 2:
        return {
          bg: "bg-blue-500 hover:bg-blue-700",
          border: "border-blue-500",
          text: "text-blue-500",
        };
      case 3:
        return {
          bg: "bg-yellow-300 hover:bg-yellow-500",
          border: "border-yellow-300",
          text: "text-yellow-300",
        };
      case 4:
        return {
          bg: "bg-orange-500 hover:bg-orange-700",
          border: "border-orange-500",
          text: "text-orange-500",
        };
      case 5:
        return {
          bg: "bg-amber-500 hover:bg-amber-700",
          border: "border-amber-500",
          text: "text-amber-500",
        };
      case 6:
        return {
          bg: "bg-green-500 hover:bg-green-700",
          border: "border-green-500",
          text: "text-green-500",
        };
      case 7:
        return {
          bg: "bg-teal-500 hover:bg-teal-700",
          border: "border-teal-500",
          text: "text-teal-500",
        };
      case 8:
        return {
          bg: "bg-red-500 hover:bg-red-700",
          border: "border-red-500",
          text: "text-red-500",
        };
      default:
        return {
          bg: "bg-white",
          border: "border-white",
          text: "text-white",
        };
    }
  };

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  //Filter state
  const [filterKewenanganKlinis] = useState<string>("all");
  //setFilterKewenanganKlinis

  // Filter the detailList by searchTerm (case-insensitive)
  const filteredDetailList = detilDocument.filter((detail) => {
    const matches_DocumentShortName = detail.short_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matches_NIP_Application = detail.create_nip
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matches_Name_Application = detail.create_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return (
      matches_DocumentShortName ||
      matches_NIP_Application ||
      matches_Name_Application
    );
  });

  // Pagination State - Fixed to 4 cards per page (1 row)
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4; // Fixed to 4 cards per page

  // Calculate total pages
  const totalPages = Math.ceil(filteredDetailList.length / rowsPerPage);

  // Get current page cards
  const indexOfLastCard = currentPage * rowsPerPage;
  const indexOfFirstCard = indexOfLastCard - rowsPerPage;
  const currentDetailList = filteredDetailList.slice(
    indexOfFirstCard,
    indexOfLastCard
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterKewenanganKlinis]);

  useEffect(() => {
    // Get the full URL
    const fullUrl = window.location.href;
    console.log("Full URL:", fullUrl);
  }, [detilDocument]);

  const onClickCard = async (
    application: number,
    credential: number,
    MedicalPersonal: string
  ) => {
    const fullUrl = window.location.href;
    await SetCookieApplication(application);
    await SetCookieCedential(credential);
    SetCookieMedicalPersonal(MedicalPersonal);
    if (onCardClick) {
      await onCardClick();
    }
    if (fullUrl.includes("/Manage_SK_Aplikasi")) {
      router.push(`/Dashboard/Manage_SK_Aplikasi/Cetak_SK`);
    } else {
      router.push(`/Dashboard/Detail_Status`);
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
            placeholder="Cari Aplikasi Perawatan Klinis..."
            className="pl-10 border-blue-700 border-2 text-4xl h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Cards Grid - Fixed to show exactly 4 cards in one row */}
      <div className="mb-6">
        {currentDetailList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
            {currentDetailList.map((detail, i) => (
              <div
                key={detail.id_application}
                className={`bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer border-l-4 ${
                  getStatusColor(detail.status_app).border
                } hover:bg-blue-50/75`}
              >
                <div className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-blue-600 font-bold text-md truncate">
                        {detail.short_name}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {detail.create_nip}
                      </p>
                    </div>

                    <span
                      className={`ml-2 px-2 py-1 rounded-md font-bold ${
                        getStatusColor(detail.status_app).bg
                      } text-white whitespace-nowrap`}
                      onClick={() =>
                        onClickCard(
                          detail.id_application,
                          detail.id_document,
                          detail.create_nip
                        )
                      }
                    >
                      {detail.status_name}
                    </span>
                  </div>

                  <p className="text-gray-800 text-sm font-medium mb-2 truncate">
                    {detail.create_name}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-gray-400 text-[10px] mb-0.5">
                        DIAJUKAN
                      </p>
                      <p className="text-gray-700 font-medium">
                        {toDBTime(detail.create_date)}
                      </p>
                    </div>
                    <div
                      className={`text-right text-blue-600 ${
                        getStatusColor(detail.status_app).text
                      }`}
                    >
                      <p className=" text-[10px] mb-0.5">Pembaruan</p>
                      <p className=" font-semibold">
                        {detail.last_update_date
                          ? toDBTime(detail.last_update_date)
                          : toDBTime(detail.create_date)}
                      </p>
                    </div>
                  </div>
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

      {/* Pagination - Shows total pages based on 4 cards per page */}
      <div className="flex justify-center items-center bg-blue-50  rounded-2xl py-1.5 ">
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
    </div>
  );
}

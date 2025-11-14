"use client";
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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

import { LogBookDetail } from "@/connection/interface";
import { GetCookieAccessAs } from "@/function/cookie/access";

import {
  POST_logbook,
  PUT_logbook,
  PUT_Approve_logbook,
  DELETE_logbook,
} from "@/connection/log_book";
import { toDBTime } from "@/function/dateTime";

export default function log_book({
  data_logbook,
  data_logbookMutate,
}: {
  data_logbook: LogBookDetail[];
  data_logbookMutate: () => Promise<LogBookDetail[] | null | undefined>;
}) {
  // const router = useRouter();
  const [accessAs, serAccessAs] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputNote, setInputNote] = useState("");
  const [isDrug, setIsDrug] = useState(false);
  const [drugNote, setDrugNote] = useState("");

  useEffect(() => {
    getAccess();
  }, []);

  const getAccess = async () => {
    const access = await GetCookieAccessAs();
    serAccessAs(Number(access));
  };

  //Pagination
  const groupDataByCategory = (data: LogBookDetail[]) => {
    const grouped = data.reduce(
      (lgbk, item) => {
        const id_category = item.id_category_logbook;
        const name_category = item.category_logbook_name;
        const count = item.count_min;
        // Always create the user entry if it doesn't exist
        if (!lgbk[id_category]) {
          lgbk[id_category] = {
            id_category_logbook: id_category,
            category_logbook_name: name_category,
            count_min: count,
            logbook_details: [],
          };
        }
        lgbk[id_category].logbook_details.push({
          id_logbook: item.id_logbook,
          create_date: item.create_date,
          logbook_note: item.logbook_note,
          logbook_drug: item.logbook_drug,
          logbook_sop: item.logbook_sop,
          supervisor_nip: item.supervisor_nip,
          supervisor_name: item.supervisor_name,
        });
        return lgbk;
      },
      {} as Record<
        string,
        {
          id_category_logbook: number;
          category_logbook_name: string;
          count_min: number;
          logbook_details: Array<{
            id_logbook: number;
            create_date: Date;
            logbook_note: string;
            logbook_drug: string;
            logbook_sop: number;
            supervisor_nip: string;
            supervisor_name: string;
          }>;
        }
      >
    );
    return Object.values(grouped);
  };
  // Filter the detailList by searchTerm (case-insensitive)
  const groupedData = groupDataByCategory(data_logbook ?? []);
  const filteredGroupedData = groupedData.filter((detail) => {
    return detail.logbook_details?.some(
      (items) =>
        items?.supervisor_nip
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        items?.supervisor_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        items?.logbook_note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        items?.logbook_drug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail?.category_logbook_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  // Calculate total pages
  const totalPages = Math.ceil(filteredGroupedData.length / rowsPerPage);

  // Get current page rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentGroupedData = filteredGroupedData.slice(
    indexOfFirstRow,
    indexOfLastRow
  );
  //---------------------------------------------------------------------------------------------------------
  const inputDetailLogBook = async (id_category_logbook: number) => {
    try {
      if (isDrug) {
        const result = await POST_logbook(
          id_category_logbook,
          inputNote,
          drugNote
        );
        if (result) {
          toast.success("Input Log Book beserta catatan obat Berhasil");
          await data_logbookMutate();
        }
      } else {
        const result = await POST_logbook(id_category_logbook, inputNote, null);
        if (result) {
          console.log("RESULT", result);
          toast.success("Input Log Book Berhasil");
          await data_logbookMutate();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal Input Log Book");
    } finally {
      setIsDrug(false);
      setInputNote("");
      setDrugNote("");
    }
  };

  const updateDetailLogBook = async (id_logbook: number) => {
    try {
      if (isDrug) {
        const result = await PUT_logbook(id_logbook, inputNote, drugNote);
        if (result) {
          console.log("RESULTUPDATE", result);
          toast.success("Edit Log Book Beserta Catatan Obat Berhasil");
          await data_logbookMutate();
        }
      } else {
        const result = await PUT_logbook(id_logbook, inputNote, null);
        if (result) {
          console.log("RESULTUPDATE", result);
          toast.success("Edit Log  Berhasil");
          const mutate = await data_logbookMutate();
          console.log("result:", mutate);
        }
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Edit Log  Gagal");
    } finally {
      setIsDrug(false);
      setInputNote("");
      setDrugNote("");
    }
  };
  const approveDetailLogBook = async (id_logbook: number, data_sop: number) => {
    try {
      const result = await PUT_Approve_logbook(id_logbook, data_sop);
      if (result) {
        console.log("RESULTAPPROVE", result);
        toast.success(
          data_sop === 1 ? "Berhasil Approve" : "Berhasil UnApprove"
        );
        await data_logbookMutate();
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Gagal Approve");
    } finally {
      window.location.reload();
    }
  };

  const deleteDetailLogBook = async (id_logbook: number) => {
    try {
      const result = await DELETE_logbook(id_logbook);
      if (result) {
        console.log("RESULTDELETE", result);
        toast.success("Hapus Log Book Beserta Catatan Obat Berhasil");
        await data_logbookMutate();
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Hapus Log  Gagal");
    }
  };
  //-----------------------------------------------------------------------

  return (
    <div>
      <div className="flex justify-center mb-4 font-bold text-4xl text-blue-500">
        LOG BOOK {}
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4 ">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <Input
            type="text"
            placeholder="Pencarian... "
            className="pl-10 border-blue-700 border-2 text-4xl h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        {currentGroupedData.length > 0 ? (
          <table className="w-full">
            <thead>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold text-xl w-5">No.</TableHead>
                <TableHead className="font-bold text-xl w-56">
                  Jenis Ketrampilan
                </TableHead>
                <TableHead className="font-bold text-xl w-5">Jml</TableHead>
                <TableHead className="font-bold text-xl text-center w-[100px]">
                  Tanggal
                </TableHead>
                <TableHead className="font-bold text-xl w-72 ">
                  <div className="flex justify-between">
                    <span className="pl-3">Inisial / No.RM</span>
                    <span className=" pr-2 text-orange-400">Nama Obat</span>
                  </div>
                </TableHead>
                <TableHead className="font-bold text-xl w-10">SOP</TableHead>
                <TableHead className="font-bold text-xl w-36">
                  Disetujui Oleh
                </TableHead>
                {accessAs === 5 ? (
                  <TableHead className="font-bold text-xl w-10">
                    Action
                  </TableHead>
                ) : (
                  <TableHead className="font-bold text-xl w-10"></TableHead>
                )}
              </TableRow>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentGroupedData.map((detail, i) => (
                <tr
                  key={detail.id_category_logbook}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {/* No. */}
                  <TableCell className="text-center font-bold">
                    {indexOfFirstRow + i + 1}
                  </TableCell>

                  {/* Jenis Ketrampilan */}
                  <td className="align-middle">
                    <div className="flex items-center gap-3 my-1">
                      {/* left part */}
                      <div className="flex-1">
                        <p className="text-lg  font-semibold ">
                          {detail.category_logbook_name}
                        </p>
                      </div>
                      {/* right part */}
                      <div className="flex flex-col gap-2 pr-12">
                        {accessAs === 5 && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="group relative inline-block">
                                  <Button className="w-10 bg-green-500">
                                    <Plus />
                                  </Button>
                                  <span className="absolute left-full top-1/2 -translate-y-1/2 -translate-x-9 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    Menambahkan Logbook
                                  </span>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="md:min-w-[520px] flex flex-col items-center justify-center">
                                <DialogTitle>
                                  <div className="font-medium text-lg">
                                    Menambahkan Logbook
                                  </div>
                                  <div className="text-lg font-light">
                                    {detail.category_logbook_name}
                                  </div>
                                </DialogTitle>

                                <Input
                                  type="text"
                                  placeholder="Masukkan Nomor RM dan Inisial..."
                                  className=" border-blue-500 border-2 h-11"
                                  value={inputNote}
                                  onChange={(e) => setInputNote(e.target.value)}
                                />
                                <div className="flex flex-row w-full space-x-4">
                                  <div>
                                    <label
                                      className={
                                        isDrug ? `text-black ` : `text-gray-300`
                                      }
                                    >
                                      Nama Obat
                                    </label>
                                    <Input
                                      type="text"
                                      placeholder="Masukkan Nama Obat..."
                                      disabled={!isDrug}
                                      className="pl-10 border-orange-500 border-2  h-11 mt-2"
                                      value={drugNote}
                                      onChange={(e) =>
                                        setDrugNote(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 mr-4">
                                    {drugNote
                                      ? isDrug === true
                                      : isDrug === false}
                                    <Checkbox
                                      checked={isDrug}
                                      onCheckedChange={(checked) =>
                                        setIsDrug(checked === true)
                                      }
                                    />
                                    <label>Ada Obat</label>
                                  </div>
                                </div>

                                <div className="space-x-4">
                                  <DialogClose asChild>
                                    <Button
                                      onClick={() => {
                                        inputDetailLogBook(
                                          detail.id_category_logbook
                                        );
                                      }}
                                      className=" bg-green-400"
                                    >
                                      Save
                                    </Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button
                                      onClick={() => {
                                        setIsDrug(false),
                                          setInputNote(""),
                                          setDrugNote("");
                                      }}
                                      className=" bg-red-400"
                                    >
                                      Close
                                    </Button>
                                  </DialogClose>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}

                        <div className="flex justify-center">
                          {detail.count_min}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* jml */}
                  <td className="align-middle">
                    <div className="divide-y divide-gray-200">
                      {detail.logbook_details.map((logbook, idx) => (
                        <div
                          key={idx}
                          className="text-lg p-1 cursor-pointer hover:bg-blue-100"
                        >
                          {logbook.id_logbook ? (
                            <p className="pl-4"> {indexOfFirstRow + idx + 1}</p>
                          ) : (
                            <p className="pl-4"> -</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  {/* Tanggal */}
                  <td className="align-middle">
                    <div className="divide-y divide-gray-200">
                      {detail.logbook_details.map((logbook, idx) => (
                        <div
                          key={idx}
                          className=" text-sm py-2 cursor-pointer hover:bg-blue-100"
                        >
                          <p className="">{toDBTime(logbook.create_date)}</p>
                        </div>
                      ))}
                    </div>
                  </td>
                  {/*  Inisial / No.RM */}
                  <td className="align-middle">
                    <div className="divide-y divide-gray-200">
                      {detail.logbook_details.map((logbook, idx) => (
                        <div
                          key={idx}
                          className="text-lg p-1 cursor-pointer hover:bg-blue-100 flex justify-between"
                        >
                          <span className="pl-4">{logbook.logbook_note}</span>
                          <span className=" text-orange-400 font-semibold pr-2">
                            {logbook.logbook_drug}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  {/* SOP */}
                  <td className="align-middle">
                    <div className="divide-y divide-gray-200">
                      {detail.logbook_details.map((logbook, idx) => (
                        <div
                          key={idx}
                          className="text-lg p-1 cursor-pointer hover:bg-blue-100"
                        >
                          {logbook.id_logbook ? (
                            accessAs == 4 ? (
                              <div className="space-x-1">
                                <Button
                                  className={`w-6 h-6 ${
                                    logbook.logbook_sop === 1
                                      ? "bg-green-300"
                                      : ""
                                  }`}
                                  variant="outline"
                                  onClick={() =>
                                    approveDetailLogBook(logbook.id_logbook, 1)
                                  }
                                >
                                  <Check />
                                </Button>
                                <Button
                                  className={`w-6 h-6 ${
                                    logbook.logbook_sop === 0
                                      ? "bg-red-300"
                                      : ""
                                  }`}
                                  variant="outline"
                                  onClick={() =>
                                    approveDetailLogBook(logbook.id_logbook, 0)
                                  }
                                >
                                  <X />
                                </Button>
                              </div>
                            ) : (
                              <div className="pl-4">
                                {logbook.logbook_sop === 1 ? (
                                  <div className="w-6 h-6  rounded-md  bg-green-500 text-white">
                                    <Check />
                                  </div>
                                ) : logbook.logbook_sop === 0 ? (
                                  <div className="w-6 h-6  rounded-md  bg-red-500 text-white">
                                    <X />
                                  </div>
                                ) : (
                                  <span>-</span>
                                )}
                              </div>
                            )
                          ) : (
                            <p className="pl-4">-</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  {/*  Disetujui Oleh */}
                  <td className="align-middle">
                    <div className="divide-y divide-gray-200">
                      {detail.logbook_details.map((logbook, idx) => (
                        <div
                          key={idx}
                          className="text-lg p-1 cursor-pointer hover:bg-blue-100"
                        >
                          <p className="pl-4 ">
                            {logbook.supervisor_nip} <br />
                            {logbook.supervisor_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </td>
                  {/*  Action */}
                  <td className="align-middle">
                    <div className="divide-y divide-gray-200">
                      {detail.logbook_details.map((logbook, idx) => (
                        <div
                          key={idx}
                          className="text-lg p-1 cursor-pointer hover:bg-blue-100"
                        >
                          {accessAs === 5 && (
                            <>
                              {logbook.id_logbook && logbook.logbook_note && (
                                <div className="space-x-2">
                                  {/* Edit Dialog */}
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          setInputNote(logbook.logbook_note);
                                          setDrugNote(logbook.logbook_drug);
                                          setIsDrug(
                                            logbook.logbook_drug ? true : false
                                          );
                                        }}
                                        className="bg-blue-500 h-7 px-2"
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="md:min-w-[550px]">
                                      <DialogHeader>
                                        <DialogTitle>Edit Logbook</DialogTitle>
                                      </DialogHeader>
                                      <label>Nomor RM dan Inisial</label>
                                      <Input
                                        type="text"
                                        placeholder="Masukkan Nomor RM dan Inisial..."
                                        className=" border-blue-500 border-2 h-11"
                                        value={inputNote}
                                        onChange={(e) =>
                                          setInputNote(e.target.value)
                                        }
                                      />
                                      <div className="flex flex-row w-full space-x-4">
                                        <div>
                                          <label
                                            className={
                                              isDrug
                                                ? `text-black `
                                                : `text-gray-300`
                                            }
                                          >
                                            Nama Obat
                                          </label>
                                          <Input
                                            type="text"
                                            placeholder="Masukkan Nama Obat..."
                                            disabled={!isDrug}
                                            className="pl-10 border-orange-500 border-2  h-11 mt-2"
                                            value={drugNote}
                                            onChange={(e) =>
                                              setDrugNote(e.target.value)
                                            }
                                          />
                                        </div>
                                        <div className="flex items-center gap-2 mr-4">
                                          {drugNote
                                            ? isDrug === true
                                            : isDrug === false}
                                          <Checkbox
                                            checked={isDrug}
                                            onCheckedChange={(checked) =>
                                              setIsDrug(checked === true)
                                            }
                                          />
                                          <label>Ada Obat</label>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <DialogClose asChild>
                                          <Button
                                            onClick={() => {
                                              updateDetailLogBook(
                                                logbook.id_logbook
                                              );
                                            }}
                                            className="bg-green-500"
                                          >
                                            Update
                                          </Button>
                                        </DialogClose>

                                        <DialogClose asChild>
                                          <Button
                                            onClick={() => {
                                              setIsDrug(false),
                                                setInputNote(""),
                                                setDrugNote("");
                                            }}
                                            className="bg-red-500"
                                          >
                                            Batal
                                          </Button>
                                        </DialogClose>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>

                                  {/* Delete Dialog */}
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        className="bg-red-500 h-7 px-2"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Apakah yakin untuk menghapus access
                                        </DialogTitle>
                                        <DialogDescription>
                                          {logbook.logbook_note}
                                          <br />
                                          {logbook.logbook_drug && (
                                            <span>
                                              dengan obat {logbook.logbook_drug}
                                            </span>
                                          )}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter className="mt-6">
                                        <DialogClose asChild>
                                          <Button
                                            onClick={() => {
                                              deleteDetailLogBook(
                                                logbook.id_logbook
                                              );
                                            }}
                                            className="bg-red-500"
                                          >
                                            Delete
                                          </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                          <Button className="bg-green-500">
                                            Batal
                                          </Button>
                                        </DialogClose>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center p-10">
            <p>Tidak ada data Log-Book</p>
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

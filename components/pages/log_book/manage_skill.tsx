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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import { CategoryLogbook } from "@/connection/interface";
import { toDBTime } from "@/function/dateTime";
import {
  POST_category_logbook,
  PUT_category_logbook,
  DELETE_category_logbook,
} from "@/connection/log_book";

export default function Log_Book_Skill({
  data_category_logbook,
  mutate_category_logbook,
}: {
  data_category_logbook: CategoryLogbook[];
  mutate_category_logbook: () => Promise<CategoryLogbook[] | null | undefined>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [input, setInput] = useState("");
  const [edit, setEdit] = useState("");

  //Pagination
  // Filter the detailList by searchTerm (case-insensitive)
  const filteredGroupedData = data_category_logbook.filter((items) => {
    return items.declaration.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15); // Default rows per page

  // Calculate total pages
  const totalPages = Math.ceil(filteredGroupedData.length / rowsPerPage);

  // Get current page rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentGroupedData = filteredGroupedData.slice(
    indexOfFirstRow,
    indexOfLastRow
  );
  //-----------------------------------------------------------------------
  const handleInput = async () => {
    try {
      const response = await POST_category_logbook(input);
      if (response) {
        toast.success("Berhasil Menyimpan Data Dokumen");
        // Refresh data after successful input
        await mutate_category_logbook();
      }
    } catch (error) {
      console.error("Error saving Data Document to Database:", error);
      toast.error("Gagal Menyimpan Data Dokumen");
    } finally {
      setInput("");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const response = await PUT_category_logbook(id, edit);
      if (response) {
        toast.success("Berhasil Update Data Ketrampilan");
        await mutate_category_logbook();
      }
    } catch (error) {
      console.error("Error saving Update to Database:", error);
      toast.error("Gagal Merubah Data");
    } finally {
      setEdit("");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await DELETE_category_logbook(id);
      if (response) {
        toast.success("Berhasil Hapus Data Ketrampilan");
        await mutate_category_logbook();
      }
    } catch (error) {
      console.error("Error deleting Data to Database:", error);
      toast.error("Gagal menghapus Data");
    }
  };

  return (
    <div>
      <div className=" border-2 border-blue-400 rounded-lg p-2 shadow-2xl space-y-3">
        <div className="font-bold rounded-lg border-2 text-white bg-blue-400 text-center shadow-xl text-xl">
          <p className="m-2">BUAT KETRAMPILAN</p>
        </div>

        {/* INPUT */}
        <Input
          className="font-semibold border-blue-400 border-2 h-12 !text-xl"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        ></Input>
        <Button
          className="bg-blue-400 hover:bg-yellow-300"
          onClick={() => handleInput()}
        >
          Input
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 mt-4 gap-4 ">
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
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="45">45</SelectItem>
              <SelectItem value="90">90</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TABLE */}
      <div className="border rounded-md overflow-hidden ">
        {currentGroupedData.length > 0 ? (
          <table className="w-full">
            <thead>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold text-xl text-center w-5">
                  No.
                </TableHead>
                <TableHead className="font-bold text-xl text-center w-5">
                  ID.
                </TableHead>
                <TableHead className="font-bold text-xl w-[600px]">
                  Ketrampilan
                </TableHead>
                <TableHead className="font-bold text-xl w-40">
                  Tanggal Dibuat
                </TableHead>
                <TableHead className="font-bold text-xl w-10">Action</TableHead>
              </TableRow>
            </thead>
            <tbody>
              {currentGroupedData.map((items, index) => (
                <tr key={items.id} className="cursor-pointer hover:bg-gray-100">
                  {/* No. */}
                  <TableCell className="text-center font-bold">
                    {indexOfFirstRow + index + 1}
                  </TableCell>

                  {/* ID. */}

                  <td className="align-middle">
                    <div className="text-lg  text-center text-cyan-300 font-bold p-1 cursor-pointer hover:bg-blue-100">
                      {items.id}
                    </div>
                  </td>

                  {/* Ketrampilan. */}
                  <td className="align-middle">
                    <div className="text-lg p-1 cursor-pointer hover:bg-blue-100">
                      {items.declaration}{" "}
                    </div>
                  </td>

                  {/*   Tanggal Dibuat */}
                  <td className="align-middle">
                    <div className="text-lg p-1 cursor-pointer hover:bg-blue-100">
                      {toDBTime(items.create_date)}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="align-middle">
                    <div className="text-lg p-1 cursor-pointer hover:bg-blue-100">
                      <div className="space-x-2">
                        {/* Edit */}
                        <Dialog
                          onOpenChange={(isOpen) => {
                            if (isOpen) {
                              setEdit(items.declaration);
                            } else {
                              setEdit("");
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-blue-500 h-7 px-2">
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="md:min-w-[740px]  ">
                            <DialogTitle>
                              <div className="font-medium text-lg justify-start">
                                Edit Ketrampilan
                                <div className="text-lg font-light text-gray-400">
                                  {items.declaration}
                                </div>
                              </div>
                            </DialogTitle>
                            <Input
                              type="text"
                              placeholder="Nama Ketrampilan"
                              value={edit}
                              onChange={(e) => setEdit(e.target.value)}
                            />
                            <DialogClose asChild>
                              <Button
                                onClick={() => {
                                  handleUpdate(items.id);
                                }}
                                className=" bg-green-400"
                              >
                                Save
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button className=" bg-red-400">Close</Button>
                            </DialogClose>
                          </DialogContent>
                        </Dialog>

                        {/* Delete */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-red-500 h-7 px-2">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="md:min-w-[740px]  ">
                            <DialogTitle>
                              <div className="font-medium text-lg justify-start">
                                Hapus Ketrampilan
                                <div className="text-lg font-light text-gray-400">
                                  {items.declaration}
                                </div>
                              </div>
                            </DialogTitle>
                            <DialogClose asChild>
                              <Button
                                onClick={() => {
                                  handleDelete(items.id);
                                }}
                                className=" bg-green-400"
                              >
                                Save
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button className=" bg-red-400">Close</Button>
                            </DialogClose>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center p-10">
            <p>Tidak ada data Keahlian</p>
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

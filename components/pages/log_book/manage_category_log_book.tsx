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
import { Combobox } from "@/components/combo-box";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import { LogBookCategory, CategoryLogbook } from "@/connection/interface";

import {
  POST_category_and_document_logbook,
  PUT_category_and_document_logbook,
  DELETE_category_and_document_logbook,
} from "@/connection/log_book";

interface AccessAndMoreProps {
  data_category_logbook: CategoryLogbook[];
  onChange: (values: { dataCategory: number | null; minimum: number }) => void;
  default_category_logbook?: number | null;
  defaultMinimum?: number;
}

export default function log_book({
  data_detail_category_logbook,
  data_detail_category_logbookMutate,
  data_category_logbook,
}: {
  data_detail_category_logbook: LogBookCategory[];
  data_detail_category_logbookMutate: () => Promise<
    LogBookCategory[] | null | undefined
  >;
  data_category_logbook: CategoryLogbook[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIdCategoryLogBook, setSelectedIdCategoryLogBook] = useState<
    number | null
  >(null);
  const [selectedMinimum, setSelectedMinimum] = useState(0);

  //Pagination
  const groupDataByCategory = (data: LogBookCategory[]) => {
    const grouped = data.reduce(
      (lgc, item) => {
        const id = item.id;
        const id_document = item.id_document;
        const short_name = item.short_name;
        const name_document = item.name_document;
        const status = item.status;
        // Always create the user entry if it doesn't exist
        if (!lgc[id_document]) {
          lgc[id_document] = {
            id,
            id_document,
            short_name,
            name_document,
            status,
            category: [],
          };
        }
        lgc[id_document].category.push({
          id_category_logbook: item.id_category_logbook,
          declaration: item.declaration,
          count_min: item.count_min,
          create_date: item.create_date,
        });
        return lgc;
      },
      {} as Record<
        string,
        {
          id: number;
          id_document: number;
          short_name: string;
          name_document: string;
          status: number;
          category: Array<{
            id_category_logbook: number;
            declaration: string;
            count_min: number;
            create_date: Date;
          }>;
        }
      >
    );
    return Object.values(grouped);
  };
  // Filter the detailList by searchTerm (case-insensitive)
  const groupedData = groupDataByCategory(data_detail_category_logbook ?? []);
  const filteredGroupedData = groupedData.filter((detail) => {
    return detail.category?.some(
      (items) =>
        items?.count_min?.toString().includes(searchTerm.toLowerCase()) ||
        items?.declaration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail?.short_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail?.name_document?.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
  const handleInputDataDocument = async (id_document: number) => {
    try {
      const response = await POST_category_and_document_logbook(
        id_document,
        selectedIdCategoryLogBook!,
        selectedMinimum
      );
      if (response) {
        toast.success("Berhasil Menyimpan Data Dokumen");
        // Refresh data after successful input
        await data_detail_category_logbookMutate();
      }
    } catch (error) {
      console.error("Error saving Data Document to Database:", error);
      toast.error("Gagal Menyimpan Data Dokumen");
    } finally {
      setSelectedIdCategoryLogBook(null);
      setSelectedMinimum(0);
    }
  };

  const handleUpdateDataDetailCategory = async (
    id: number,
    id_category: number,
    count_min: number
  ) => {
    try {
      const response = await PUT_category_and_document_logbook(
        id,
        id_category,
        count_min
      );
      if (response) {
        toast.success("Berhasil Update Data Ketrampilan");
        await data_detail_category_logbookMutate();
      }
    } catch (error) {
      console.error("Error saving Update to Database:", error);
      toast.error("Gagal Merubah Data");
    } finally {
      setSelectedIdCategoryLogBook(null);
      setSelectedMinimum(0);
    }
  };

  const handleDeleteDataDetailCategory = async (id: number) => {
    try {
      const response = await DELETE_category_and_document_logbook(id);
      if (response) {
        toast.success("Berhasil Hapus Data Ketrampilan");
        await data_detail_category_logbookMutate();
      }
    } catch (error) {
      console.error("Error deleting Data to Database:", error);
      toast.error("Gagal menghapus Data");
    }
  };
  return (
    <div>
      <div className="flex justify-center mb-4 font-bold text-2xl text-blue-500">
        LOG BOOK CATEGORY
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
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="45">45</SelectItem>
              <SelectItem value="90">90</SelectItem>
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
                <TableHead className="font-bold text-xl w-72">
                  Dokumen Kredensial
                </TableHead>
                <TableHead className="font-bold text-xl w-5">No.</TableHead>
                <TableHead className="font-bold text-xl pl-4 w-[600px]">
                  Ketrampilan
                </TableHead>
                <TableHead className="font-bold text-xl w-20">Min</TableHead>

                <TableHead className="font-bold text-xl w-10">Action</TableHead>
              </TableRow>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentGroupedData.map((detail, i) => (
                <tr
                  key={detail.id_document}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {/* No. */}
                  <TableCell className="text-center font-bold">
                    {indexOfFirstRow + i + 1}
                  </TableCell>

                  {/* Dokumen Kredensial */}
                  <td className="align-middle">
                    <div className="flex items-center gap-3 my-1">
                      {/* left part */}
                      <div className="flex-1">
                        <p className="text-lg  font-semibold  flex items-center gap-2">
                          {detail.short_name}{" "}
                          {detail.status === 1 ? (
                            <span className="text-white font-semibold  text-xs rounded-md p-3 py-0.5 bg-green-500">
                              AKTIF
                            </span>
                          ) : (
                            <span className="text-white font-semibold  text-xs rounded-md p-3 py-0.5 bg-red-500">
                              MUTE
                            </span>
                          )}
                        </p>
                        <p className="text-lg  font-semibold ">
                          {detail.name_document}{" "}
                        </p>
                      </div>
                      {/* right part */}
                      <div className="flex flex-col gap-2 pr-12">
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
                          <DialogContent className="md:min-w-[740px]  ">
                            <DialogTitle>
                              <div className="font-medium text-lg justify-start">
                                Menambahkan Log-Book
                                <div className="text-lg font-light text-gray-400">
                                  Pada {detail.short_name}
                                </div>
                              </div>
                            </DialogTitle>
                            <div className="flex flex-col items-center">
                              <AccessAndMore
                                data_category_logbook={
                                  data_category_logbook ?? []
                                }
                                default_category_logbook={null}
                                defaultMinimum={selectedMinimum}
                                onChange={({ dataCategory, minimum }) => {
                                  setSelectedIdCategoryLogBook(dataCategory);
                                  setSelectedMinimum(minimum);
                                }}
                              />
                              <div className="space-x-4 mt-4">
                                <DialogClose asChild>
                                  <Button
                                    onClick={() => {
                                      handleInputDataDocument(
                                        detail.id_document
                                      );
                                    }}
                                    className=" bg-green-400"
                                  >
                                    Save
                                  </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button className=" bg-red-400">Close</Button>
                                </DialogClose>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </td>
                  {/* jml */}
                  <td className="align-middle">
                    <div className="divide-y divide-gray-200">
                      {detail.category.map((category, idx) => (
                        <div
                          key={idx}
                          className="text-lg p-1 cursor-pointer hover:bg-blue-100"
                        >
                          {detail.id ? (
                            <p className="pl-4"> {indexOfFirstRow + idx + 1}</p>
                          ) : (
                            <p className="pl-4">-</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  {/* Ketrampilan */}
                  <td className="align-middle">
                    <div className="divide-y divide-gray-200">
                      {detail.category.map((category, idx) => (
                        <div
                          key={idx}
                          className="text-lg p-1 cursor-pointer hover:bg-blue-100"
                        >
                          <p className="pl-4">{category.declaration}</p>
                        </div>
                      ))}
                    </div>
                  </td>
                  {/*  Jumlah Minimal */}
                  <td className="align-middle">
                    <div className="divide-y divide-gray-200">
                      {detail.category.map((category, idx) => (
                        <div
                          key={idx}
                          className="text-lg p-1 cursor-pointer hover:bg-blue-100"
                        >
                          <p className="pl-4">{category.count_min}</p>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/*  Action */}
                  <td className="align-middle">
                    <div className="divide-y divide-gray-200">
                      {detail.category.map((category, idx) => (
                        <div
                          key={idx}
                          className="text-lg p-1 cursor-pointer hover:bg-blue-100"
                        >
                          {category.id_category_logbook &&
                          category.declaration ? (
                            <div className="space-x-2">
                              {/* Edit Dialog */}
                              <Dialog
                                onOpenChange={(isOpen) => {
                                  if (isOpen) {
                                    // When opening - set the values
                                    setSelectedIdCategoryLogBook(
                                      category.id_category_logbook
                                    );
                                    setSelectedMinimum(category.count_min);
                                  } else {
                                    // When closing - reset the values
                                    setSelectedIdCategoryLogBook(null);
                                    setSelectedMinimum(0);
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-blue-500 h-7 px-2"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="md:min-w-[740px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      <div className="font-medium text-lg justify-start">
                                        Edit {detail.short_name}
                                        <div className="text-lg font-light text-gray-400">
                                          Current: {category.declaration}
                                        </div>
                                      </div>
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="flex flex-col items-center">
                                    <AccessAndMore
                                      data_category_logbook={
                                        data_category_logbook ?? []
                                      }
                                      default_category_logbook={
                                        selectedIdCategoryLogBook
                                      }
                                      defaultMinimum={selectedMinimum}
                                      onChange={({ dataCategory, minimum }) => {
                                        setSelectedIdCategoryLogBook(
                                          dataCategory
                                        );
                                        setSelectedMinimum(minimum);
                                      }}
                                    />
                                    <div className="space-x-4 mt-4">
                                      <DialogClose asChild>
                                        <Button
                                          onClick={() => {
                                            handleUpdateDataDetailCategory(
                                              detail.id,
                                              category.id_category_logbook,
                                              category.count_min
                                            );
                                          }}
                                          className="bg-green-500"
                                        >
                                          Update
                                        </Button>
                                      </DialogClose>

                                      <DialogClose asChild>
                                        <Button className="bg-red-500">
                                          Batal
                                        </Button>
                                      </DialogClose>
                                    </div>
                                  </div>
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
                                      Apakah yakin untuk menghapus Ketrampilan
                                      <p className="font-extralight mt-4">
                                        {category.declaration}
                                      </p>
                                    </DialogTitle>
                                  </DialogHeader>
                                  <DialogFooter className="mt-6">
                                    <DialogClose asChild>
                                      <Button
                                        onClick={() => {
                                          handleDeleteDataDetailCategory(
                                            detail.id
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
                          ) : null}
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

//More page
const AccessAndMore = ({
  data_category_logbook,
  onChange,
  default_category_logbook = 0,
  defaultMinimum = 0,
}: AccessAndMoreProps) => {
  const [dataCategory, setDataCategory] = useState<number | null>(
    default_category_logbook
  );
  const [minimum, setMinimum] = useState<number>(defaultMinimum);

  useEffect(() => {
    onChange({ dataCategory, minimum });
    console.log("default :", default_category_logbook);
  }, [dataCategory, minimum]);
  return (
    <div className="flex gap-2 flex flex-col">
      <Combobox
        data={
          data_category_logbook?.map((list) => ({
            value: list.id.toString(),
            label: list.declaration,
          })) || []
        }
        value={dataCategory?.toString() || ""}
        onValueChange={(val) => setDataCategory(Number(val))}
        placeholder="Pilih Ketrampilan"
        searchPlaceholder="Mencari Ketrampilan..."
        emptyMessage="Data Ketrampilan Tidak Ditemukan."
        className="w-[700px] border-green-700 hover:border-green-500 border-4 p-5"
      />

      <Input
        type="number"
        placeholder="Jumlah Minumum..."
        value={minimum}
        className=" text-center"
        onChange={(e) => setMinimum(Number(e.target.value))}
      />
    </div>
  );
};

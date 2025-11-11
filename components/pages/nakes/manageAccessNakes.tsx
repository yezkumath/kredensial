"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableHead, TableRow, TableCell } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Combobox } from "@/components/combo-box";
import { Button } from "@/components/ui/button";

import { Search, Plus, PenTool, Pencil, Trash2 } from "lucide-react";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import {
  Access,
  EmployeesData,
  DocumentCategory,
  AccessList,
  UnitInstalationList,
} from "@/connection/interface";
import {
  POST_function_approles,
  PUT_function_approles,
  DELETE_function_approles,
} from "@/function/approles";
import {
  POST_credential_access,
  POST_credential_access_detail,
  GET_paraf_credential_access,
  PUT_credential_access,
  PUT_credential_access_detail,
  PATCH_DELETE_credential_access,
  DELETE_credential_access_detail,
} from "@/connection/access";
import { GET_credential_document_category } from "@/connection/credentials/document";
import {
  GET_InstalationList,
  GET_UnitList,
} from "@/connection/unit_instalation";
import {
  GetParafStorage,
  ResetParafStorage,
} from "@/function/localStorage/paraf";

import { ParafUpload } from "./parafUpload";

interface AccessAndMoreProps {
  dataAccessList: AccessList[];
  moreInformation: SelectionList[];
  onChange: (values: { access: string; keterangan: string }) => void;
  defaultAccess?: string;
  defaultKeterangan?: string;
}
// Define the types once
type SelectionList = { value: string; label: string };

export default function ManageAccess({
  dataNakes,
  accessData,
  dataAccessList,
  accessMutate,
}: {
  dataNakes: EmployeesData[];
  accessData: Access[];
  dataAccessList: AccessList[];
  accessMutate: () => Promise<Access[] | null | undefined>;
}) {
  // after dataAccessList select this will be filled with the detail
  const [moreInformation, setMoreInformation] = useState<SelectionList[]>([]);
  //loading state

  const [isLoadinMoreInformation, setIsLoadingMoreInformation] =
    useState<boolean>(true);

  // Selected values state
  const [selectedNakes, setSelectedNakes] = useState<string>("");
  const [selectedAccessList, setSelectedAccessList] = useState("");
  const [selectedKeterangan, setSelectedKeterangan] = useState("");
  const [imageParaf, setImageParaf] = useState("");
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  //Pagination
  const groupDataByNIP = (data: Access[]) => {
    const grouped = data.reduce(
      (acc, item) => {
        const nip = item.nakes_nip;
        const nama = item.nakes_name;
        // Always create the user entry
        if (!acc[nip]) {
          acc[nip] = {
            nakes_nip: nip,
            nakes_name: nama,
            accesses: [],
          };
        }
        // Only push access details if they exist (id and access are not null)
        //if (item && item.access) {
        acc[nip].accesses.push({
          id: item.id,
          access: item.access?.toString() || "",
          access_name: item.access_name,
          declaration: item.declaration,
          declaration_detail: item.declaration_detail,
        });
        //}
        return acc;
      },
      {} as Record<
        string,
        {
          nakes_nip: string;
          nakes_name: string;
          accesses: Array<{
            id: number;
            access: string;
            access_name: string;
            declaration: string;
            declaration_detail: string;
          }>;
        }
      >
    );

    return Object.values(grouped);
  };
  // Filter the detailList by searchTerm (case-insensitive)
  console.log("accessData:", accessData);
  const groupedData = groupDataByNIP(accessData ?? []);
  console.log("groupedData:", groupedData);
  const filteredGroupedData = groupedData.filter((detail) => {
    return detail.accesses?.some(
      (access) =>
        access?.access_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        access?.declaration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        access?.declaration_detail
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        detail?.nakes_nip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail?.nakes_name?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // useEffect(() => {}, []);

  useEffect(() => {
    getMoreInformation(Number(selectedAccessList));
  }, [selectedAccessList]);

  //---------------------------------------------------------------------------

  const getMoreInformation = async (selectedAccessList: number) => {
    console.log("Selected Access List:", selectedAccessList);
    setIsLoadingMoreInformation(true);
    try {
      // 1	Komite
      // 2	Mitra Bersari      --  Get_credential_document_category()
      // 3	Kepala Instalasi   -- GET_InstalationList()
      // 4	Penangung Jawab Pelayanan Keperawatan -- GET_UnitList()
      // 5	Tenaga Kesehatan
      if (selectedAccessList === 2) {
        // Mitra Bersari
        const response = await GET_credential_document_category();
        if (response) {
          // Transform data directly and set comboboxData
          const transformedData = response.map((item: DocumentCategory) => ({
            value: item.id_category.toString(),
            label: item.category_name,
          }));
          setMoreInformation(transformedData);
        }
      } else if (selectedAccessList === 3) {
        // Kepala Instalasi
        const response = await GET_InstalationList();
        if (response) {
          // Transform data directly and set comboboxData
          const transformedData = response.map((item: UnitInstalationList) => ({
            value: item.instalasi,
            label: item.instalasi,
          }));
          setMoreInformation(transformedData);
        }
      } else if (selectedAccessList === 4 || selectedAccessList === 5) {
        // Penangung Jawab Pelayanan Keperawatan
        const response = await GET_UnitList();
        if (response) {
          // Transform data directly and set comboboxData
          const transformedData = response.map((item: UnitInstalationList) => ({
            value: item.id_ruang,
            label: item.nama_ruangan,
          }));
          setMoreInformation(transformedData);
        }
      } else {
        setMoreInformation([]); // Clear combobox data on other selection
      }
    } catch (error) {
      setMoreInformation([]); // Clear combobox data on error
      console.error("Error fetching data More Information:", error);
      toast.error("Gagal mengambil data More Information");
    } finally {
      setIsLoadingMoreInformation(false);
    }
  };

  //------------------------------------
  const getParaf = async (nip: string) => {
    try {
      const response = await GET_paraf_credential_access(nip);

      if (response && response.length > 0) {
        console.log("paraf:", response[0].paraf);
        if (response[0].paraf === null) {
          toast.error(`data Tandatangan untuk  NIP: ${nip} kosong`);
          setImageParaf("empty");
          return;
        }
        let base64Data = response[0].paraf;

        // Clean the base64 data - remove any whitespace, newlines, or padding issues
        base64Data = base64Data.replace(/\s/g, "").trim();
        base64Data = base64Data.replace(/[^A-Za-z0-9+/=]/g, "");
        // Ensure proper base64 padding
        while (base64Data.length % 4 !== 0) {
          base64Data += "=";
        }

        // Detect format
        const format = detectImageFormat(base64Data);

        const image = `data:image/${format};base64,${base64Data}`;
        // console.log("Base64 :", cleanBase64);
        // console.log("Detected format:", format);
        setImageParaf(image);
      } else {
        setImageParaf("");
        console.log("No paraf data found for NIP:", nip);
        return;
      }
    } catch (error) {
      setImageParaf("");
      console.error("Error Getting Image:", error);
      toast.error("Gagal memuat Tanda Tangan");
    }
  };

  const detectImageFormat = (base64: string) => {
    try {
      // Remove any whitespace

      // Get first few characters to detect format
      const header = base64.substring(0, 20);

      // Base64 signatures for different formats
      if (header.startsWith("iVBORw0KGgo")) return "png";
      if (header.startsWith("/9j/")) return "jpeg";
      if (header.startsWith("UklGR")) return "webp";
      if (header.startsWith("R0lGOD")) return "gif";
      if (header.startsWith("PHN2Zy") || header.startsWith("PD94bW"))
        return "svg+xml";

      // Additional JPEG variations
      if (header.startsWith("/9j/2w") || header.startsWith("/9j/4A"))
        return "jpeg";

      // Check if it might be a BMP
      if (header.startsWith("Qk")) return "bmp";

      // Default fallback - try to determine from the actual data
      console.warn("Unknown image format, defaulting to png. Header:", header);
      return "png";
    } catch (error) {
      console.error("Error detecting image format:", error);
      return "png";
    }
  };

  //-------------------------------
  const inputDataAccess = async () => {
    try {
      if (selectedNakes) {
        const response = await POST_credential_access(selectedNakes);
        if (response) {
          toast.success("Data berhasil ditambahkan");
          await accessMutate();
          setSelectedNakes("");
        }
      }
    } catch (error) {
      console.error("Error saving Data to Database:", error);
      toast.error("Gagal Menyimpan Data");
      setSelectedNakes("");
    }
  };
  const updateParaf = async (nip_nakes: string) => {
    try {
      const paraf = GetParafStorage();
      if (nip_nakes && paraf) {
        const response = await PUT_credential_access(nip_nakes, paraf);
        if (response) {
          toast.success("Tandatangan berhasil di tambahkan");
          ResetParafStorage();
        }
      } else {
        toast.error("Pastikan Semua data terisi");
      }
    } catch (error) {
      console.error("Error Edit Paraf to Database:", error);
      toast.error("Gagal Menyimpan Tandatangan");
    }
  };

  const inputDataDetailAccess = async (nip: string) => {
    //here make POST_approles
    //app role 0 komite 1 admin 2 nakes
    // access 1 komite
    // 2 mitra bersari 3 kepala instalasi 4 penanggung jawab pelayanan keperawatan
    // 5 nakes
    try {
      if (nip && selectedAccessList) {
        // if (selectedAccessList !== "1" && !selectedKeterangan) {
        //   toast.error("Pastikan Semua data terisi");
        //   return;
        // }
        const response = await POST_credential_access_detail(
          nip,
          Number(selectedAccessList),
          selectedKeterangan
        );
        if (response) {
          toast.success("Data berhasil ditambahkan");
          try {
            await POST_function_approles(nip);
          } catch (error) {
            console.error("Failed to update app role:", error);
          }
          await accessMutate();
        }
      } else {
        toast.error("Pastikan Semua data terisi");
        return;
      }
    } catch (error) {
      console.error("Error saving Data to Database:", error);
      toast.error("Gagal Menyimpan Data");
    }
  };

  const updateDetailAccess = async (id: number, nip: string) => {
    //here make PUT_approles
    //app role 0 komite 1 admin 2 nakes
    // access 1 komite
    // 2 mitra bersari 3 kepala instalasi 4 penanggung jawab pelayanan keperawatan
    // 5 nakes
    try {
      if (id && selectedAccessList && selectedKeterangan) {
        const response = await PUT_credential_access_detail(
          id,
          Number(selectedAccessList),
          selectedKeterangan
        );
        if (response) {
          toast.success("Data berhasil ditambahkan");
          try {
            await PUT_function_approles(nip);
          } catch (error) {
            console.error("Failed to update app role:", error);
          }
          await accessMutate();
        }
      } else {
        toast.error("Pastikan Semua data terisi");
      }
    } catch (error) {
      console.error("Error saving Data to Database:", error);
      toast.error("Gagal Menyimpan Data");
    }
  };
  const deleteDetailAccess = async (id: number, nip: string) => {
    //here make delete_approles
    //app role 0 komite 1 admin 2 nakes
    // access 1 komite
    // 2 mitra bersari 3 kepala instalasi 4 penanggung jawab pelayanan keperawatan
    // 5 nakes
    try {
      console.log("id", id);
      if (id === null) return;
      const response = await DELETE_credential_access_detail(id);
      if (response) {
        toast.success("Berhasil Menghapus Data");
        try {
          const result = await PUT_function_approles(nip);
          if (result === null) {
            await DELETE_function_approles(nip);
          }
        } catch (error) {
          console.error("Failed to update app role:", error);
        }
        await accessMutate();
      }
    } catch (error) {
      console.error("Error Delete Detail Access from Database:", error);
      toast.error("Gagal Menghapus Data");
    }
  };
  const deleteAccess = async (nip: string) => {
    //here make delete_approles
    //app role 0 komite 1 admin 2 nakes
    // access 1 komite
    // 2 mitra bersari 3 kepala instalasi 4 penanggung jawab pelayanan keperawatan
    // 5 nakes
    try {
      if (nip === null) return;
      try {
        await DELETE_function_approles(nip);
      } catch (error) {
        console.error("Failed to update app role:", error);
      }
      const response = await PATCH_DELETE_credential_access(nip);
      if (response) {
        toast.success("Berhasil Menghapus Data");
        await accessMutate();
      }
    } catch (error) {
      console.error("Error Delete Access from Database:", error);
      toast.error("Gagal Menghapus Data");
    }
  };
  return (
    <div>
      <p>Menambahkan Access</p>
      <div className=" flex flex-row w-full gap-2 mb-2">
        <Combobox
          data={
            dataNakes?.map((nakes) => ({
              value: nakes.nip,
              label: nakes.nama,
            })) || []
          }
          value={selectedNakes}
          onValueChange={setSelectedNakes}
          placeholder="Pilih Nakes"
          searchPlaceholder="Mencari Nakes..."
          emptyMessage="Data Nakes Tidak Ditemukan."
          className="w-[700px] border-green-700 hover:border-green-500 border-4 p-5"
        />

        <Button
          onClick={() => inputDataAccess()}
          className=" bg-green-500 hover:bg-green-700  h-11 flex flex-row gap-2   "
        >
          <Plus className=" w-5 h-5" strokeWidth={3} />
          ADD
        </Button>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4 ">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <Input
            type="text"
            placeholder="Cari berdasarkan NIP atau Hak-Access... "
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
                <TableHead className="font-bold text-xl w-12">No.</TableHead>
                <TableHead className="font-bold text-xl md:w-[340px] lg:w-[360px]">
                  Data Nakes
                </TableHead>
                <TableHead className="font-bold text-xl pl-4">Access</TableHead>
                <TableHead className="font-bold text-xl w-5/12">
                  Keterangan
                </TableHead>
                <TableHead className="font-bold text-xl w-48">
                  Actions
                </TableHead>
              </TableRow>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentGroupedData.map((detail, i) => (
                <tr
                  key={detail.nakes_nip}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {/* Number */}
                  <TableCell className="text-center font-bold">
                    {indexOfFirstRow + i + 1}
                  </TableCell>
                  {/* Data Nakes */}
                  <td className="align-middle">
                    <div className="flex items-center gap-3 my-1">
                      <div className="flex-1">
                        <p className="text-lg font-mono font-semibold ">
                          {detail.nakes_nip}
                        </p>
                        <p className="mb-1">{detail.nakes_name}</p>
                        <p>
                          <Popover
                            onOpenChange={(isOpen) => {
                              if (!isOpen) setImageParaf("");
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => getParaf(detail.nakes_nip)}
                                className="text-xs h-7"
                              >
                                <PenTool className="w-3 h-3 mr-1" />
                                Signature
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="p-2">
                                {imageParaf === "" ? (
                                  <img
                                    src="/images/loading.gif"
                                    alt="Loading..."
                                    className="h-8 w-8"
                                  />
                                ) : imageParaf === "empty" ? (
                                  <div className="flex flex-col items-center justify-center p-6 text-gray-500 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                                    <PenTool className="w-8 h-8 mb-2 text-gray-400" />
                                    <p className="text-sm font-medium">
                                      Tanda Tangan Kosong
                                    </p>
                                  </div>
                                ) : (
                                  <img
                                    src={imageParaf}
                                    alt="Tanda Tangan"
                                    className="max-w-full"
                                  />
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </p>
                      </div>
                      {/* Right side - Action Buttons */}
                      <div className="flex flex-col gap-2 pr-12">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="group relative inline-block">
                              <Button className="w-10 bg-green-500">
                                <Plus />
                              </Button>
                              <span className="absolute left-full top-1/2 -translate-y-1/2 -translate-x-9 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                Menambah Hak Access
                              </span>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="md:min-w-[520px] flex flex-col items-center justify-center">
                            <DialogTitle>
                              <p className="font-medium text-lg">
                                Memasukkan Role Yang akan Diberikan Kepada{" "}
                                <br />
                                Nama {detail.nakes_nip}
                              </p>
                            </DialogTitle>
                            <AccessAndMore
                              dataAccessList={dataAccessList ?? []}
                              moreInformation={moreInformation ?? []}
                              defaultAccess={""}
                              defaultKeterangan={""}
                              onChange={({ access, keterangan }) => {
                                setSelectedAccessList(access);
                                setSelectedKeterangan(keterangan);
                              }}
                            />
                            <div className="space-x-4">
                              <DialogClose asChild>
                                <Button
                                  onClick={() => {
                                    inputDataDetailAccess(detail.nakes_nip);
                                  }}
                                  disabled={
                                    selectedAccessList === "" ||
                                    selectedKeterangan === ""
                                  }
                                  className=" bg-green-400"
                                >
                                  Save
                                </Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button className=" bg-red-400">Close</Button>
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="group relative inline-block">
                              <Button className="w-10 bg-blue-500">
                                <Pencil />
                              </Button>
                              <span className="absolute left-full top-1/2 -translate-y-1/2 -translate-x-9 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                Edit Tandatangan
                              </span>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="md:min-w-[600px] flex flex-col items-center justify-center">
                            <DialogTitle>Memasukkan Tanda Tangan</DialogTitle>
                            <ParafUpload />
                            <div className="space-x-4">
                              <DialogClose asChild>
                                <Button
                                  onClick={() => {
                                    updateParaf(detail.nakes_nip);
                                  }}
                                  className=" bg-green-400"
                                >
                                  Edit
                                </Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button className=" bg-red-400">Close</Button>
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Dialog */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="group relative inline-block">
                              <Button size="sm" className="bg-red-500 w-10">
                                <Trash2 />
                              </Button>
                              <span className="absolute left-full top-1/3 -translate-y-1/2 -translate-x-9 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                Menghapus Hak Access
                              </span>
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Apakah yakin untuk menghapus access{" "}
                                {detail.nakes_nip}?
                              </DialogTitle>
                            </DialogHeader>
                            <DialogFooter className="mt-6">
                              <DialogClose asChild>
                                <Button
                                  onClick={() => {
                                    deleteAccess(detail.nakes_nip);
                                  }}
                                  className="bg-red-500"
                                >
                                  Delete
                                </Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button className="bg-green-500">Batal</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </td>
                  {/* Access */}
                  <td className="align-middle">
                    <div className="divide-y divide-gray-200">
                      {detail.accesses.map((access, idx) => (
                        <div
                          key={idx}
                          className="text-lg p-1 cursor-pointer hover:bg-blue-100"
                        >
                          <p className="pl-4">{access.access_name}</p>
                        </div>
                      ))}
                    </div>
                  </td>
                  {/* Keterangan */}
                  <td className="align-middle">
                    <div className="divide-y divide-gray-200">
                      {detail.accesses.map((access, idx) => (
                        <div
                          key={idx}
                          className="text-lg p-1 cursor-pointer hover:bg-blue-100"
                        >
                          {access.declaration_detail
                            ? access.declaration_detail
                            : access.declaration}
                        </div>
                      ))}
                    </div>
                  </td>
                  {/* Action */}
                  <td className="align-middle">
                    <div className="divide-y divide-gray-200 ">
                      {detail.accesses.map((access, idx) => (
                        <div
                          key={idx}
                          className="text-lg p-1 cursor-pointer hover:bg-blue-100 space-x-4"
                        >
                          {access.id && access.access ? (
                            <>
                              {/* Edit Dialog */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedAccessList(access.access);
                                      setSelectedKeterangan(access.declaration);
                                    }}
                                    className="bg-blue-500 h-7 px-2"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="md:min-w-[550px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Edit Access {detail.nakes_name}(
                                      {detail.nakes_nip})
                                    </DialogTitle>
                                    <DialogDescription>
                                      Current: {access.access_name} -{" "}
                                      {access.declaration_detail
                                        ? access.declaration_detail
                                        : access.declaration}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <AccessAndMore
                                    dataAccessList={dataAccessList ?? []}
                                    moreInformation={moreInformation ?? []}
                                    defaultAccess={selectedAccessList}
                                    defaultKeterangan={selectedKeterangan}
                                    onChange={({ access, keterangan }) => {
                                      setSelectedAccessList(access);
                                      setSelectedKeterangan(keterangan);
                                    }}
                                  />
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button
                                        onClick={() => {
                                          updateDetailAccess(
                                            access.id,
                                            detail.nakes_nip
                                          );
                                        }}
                                        disabled={
                                          selectedAccessList === "" ||
                                          selectedKeterangan === ""
                                        }
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
                                      Apakah yakin untuk menghapus access{" "}
                                      {detail.nakes_name}({detail.nakes_nip})
                                    </DialogTitle>
                                    <DialogDescription>
                                      Current: {access.access_name} -{" "}
                                      {access.declaration_detail
                                        ? access.declaration_detail
                                        : access.declaration}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter className="mt-6">
                                    <DialogClose asChild>
                                      <Button
                                        onClick={() => {
                                          deleteDetailAccess(
                                            access.id,
                                            detail.nakes_nip
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
                            </>
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

//More page
const AccessAndMore = ({
  dataAccessList,
  moreInformation,
  onChange,
  defaultAccess = "",
  defaultKeterangan = "",
}: AccessAndMoreProps) => {
  const [access, setAccess] = useState(defaultAccess);
  const [keterangan, setKeterangan] = useState(defaultKeterangan);

  useEffect(() => {
    onChange({ access, keterangan });
  }, [access, keterangan]);

  return (
    <div className="flex gap-2 flex flex-col">
      <Select value={access} onValueChange={setAccess}>
        <SelectTrigger className="p-5 w-[400px] border-green-700 border-4">
          <SelectValue placeholder="Hak Access" />
        </SelectTrigger>
        <SelectContent>
          {dataAccessList.map((list) => (
            <SelectItem key={list.id} value={list.id.toString()}>
              {list.role_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={keterangan} onValueChange={setKeterangan}>
        <SelectTrigger className="p-5 w-[400px] border-green-700 border-4">
          <SelectValue placeholder="Keterangan tambahan..." />
        </SelectTrigger>
        <SelectContent>
          {moreInformation.map((list) => (
            <SelectItem key={list.value} value={list.value}>
              {list.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

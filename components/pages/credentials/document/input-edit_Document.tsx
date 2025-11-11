"Use Client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Pencil, Plus, X } from "lucide-react";

import { DocumentCredential, DocumentCategory } from "@/connection/interface";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  GET_credential_document_category,
  PUT_credential_document_activation,
  GET_credential_category_on_document,
  POST_credential_document_and_category_with_id,
  DELETE_credential_category,
  POST_credential_category,
  POST_copy_credential_hierarchy,
} from "@/connection/credentials/document";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page({
  onSuccess,
  isInput,
  edit,
}: {
  onSuccess?: () => void;
  isInput?: boolean;
  edit?: DocumentCredential;
}) {
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory[]>(
    []
  );
  const [credentialCategory, setCredentialCategory] = useState<
    DocumentCategory[]
  >([]);
  const [old_document_id, setOldDocumentId] = useState(-1);
  const [categoryName, setCategoryName] = useState(""); // selected category
  const [name, setName] = useState<string>(""); // document name
  const [shortName, setShortName] = useState(""); // document short name
  const [perawatKlinis, setPerawatKlinis] = useState(""); // klinis type
  const [isOpen, setIsOpen] = useState(false); // modal/dialog control

  // const { nip } = GetLoginCookie() ?? {};

  useEffect(() => {
    getDocumentCategory();
  }, []);

  const getDocumentCategory = async () => {
    try {
      const response = await GET_credential_document_category();
      if (response) setDocumentCategory(response);
    } catch (error) {
      console.error("Error fetching document categories:", error);
    }
  };

  const getCredentialCategory = async (id: number) => {
    try {
      const response = await GET_credential_category_on_document(id);
      if (response) {
        setCredentialCategory(response);
        console.log("Fetched Credential Categories:", response);
      }
    } catch (error) {
      console.error("Error fetching credential categories:", error);
    }
  };

  const getEditData = () => {
    if (edit && !isInput) {
      setOldDocumentId(edit.id);
      setName(edit.name_document);
      setShortName(edit.short_name);
      setPerawatKlinis(edit.pk_grade);
      getCredentialCategory(edit.id);
    }
  };

  const selectCategory = (id: string) => {
    const identity = parseInt(id);
    if (isInput) inputCategory(identity);
    else editCategory(identity);
  };

  const inputCategory = async (id_category: number) => {
    if (!id_category) {
      toast.error("ID Dokumen atau Kategori tidak boleh kosong!");
      return;
    }

    try {
      const foundCategory = documentCategory.find(
        (doc) => doc.id_category === id_category
      );
      if (foundCategory) {
        const newCategory = {
          id_category: id_category,
          category_name: foundCategory.category_name,
        };
        setCredentialCategory((prev) => [...prev, newCategory]);
        setCategoryName(""); // reset
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const editCategory = async (id_category: number) => {
    if (!id_category) {
      toast.error("ID Dokumen atau Kategori tidak boleh kosong!");
      return;
    }

    try {
      const response = await POST_credential_category(
        edit?.id as number,
        id_category
      );
      if (response) {
        if (edit) {
          getCredentialCategory(edit.id);
          setCategoryName("");
        }
      }
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const removeCategory = async (id: number) => {
    try {
      if (isInput) {
        // just remove locally

        setCredentialCategory((prev) =>
          prev.filter((category) => category.id_category !== id)
        );
      } else {
        // remove from DB
        if (edit) {
          console.log("Removing category ID:", edit.id, id);
          const response = await DELETE_credential_category(edit.id, id);
          if (response) {
            getCredentialCategory(edit.id);
            setCategoryName("");
            toast.success("Kategori berhasil dihapus!");
          }
        }
      }
    } catch (error) {
      console.error("Error removing category:", error);
      toast.error("Gagal menghapus kategori!");
    }
  };

  const resetForm = () => {
    setName("");
    setShortName("");
    setPerawatKlinis("");
    setCredentialCategory([]); // ⚠️ safer than `credentialCategory.length = 0`
  };

  const handleSubmit = async () => {
    if (!name || !shortName || !perawatKlinis) {
      toast.error("Semua field harus diisi!");
      return;
    }
    try {
      if (edit && !isInput) {
        // Update
        const response = await POST_credential_document_and_category_with_id(
          shortName,
          name,
          perawatKlinis,
          credentialCategory.map((cat) => cat.id_category)
        );
        if (response && typeof response === "object" && response.id) {
          // Copy hierarchy from old document to new document
          const result = await POST_copy_credential_hierarchy(
            old_document_id,
            response.id
          );
          if (result) {
            toast.success("Dokumen berhasil dibuat!");
            onSuccess?.();
            setCredentialCategory([]); // ⚠️ replaced mutation
          }
        }
      } else {
        // Insert
        const response = await POST_credential_document_and_category_with_id(
          shortName,
          name,
          perawatKlinis,
          credentialCategory.map((cat) => cat.id_category)
        );
        if (response) {
          toast.success("Dokumen berhasil dibuat!");
          onSuccess?.();
          setCredentialCategory([]); // ⚠️ replaced mutation
        }
      }
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating/updating document:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) resetForm(); // reset on close
  };

  const handlePencilClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    getEditData();
    setIsOpen(true);

    console.log("Document Category fetched on mount.", edit);
  };

  return (
    <div>
      <div className="flex space-x-3">
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          {/* ===== Trigger Button ===== */}
          <DialogTrigger asChild>
            {isInput ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="bg-green-400 shadow-xl ml-6">
                    <Plus /> Dokumen
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                  Menambahkan Dokumen baru
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handlePencilClick}
                    className="p-1 text-yellow-400 hover:bg-yellow-400 hover:text-white rounded-lg shadow-xl transition-colors bg-transparent w-24"
                  >
                    <Pencil strokeWidth={3} className="h-5 w-5 " />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="center"
                  className="text-center"
                >
                  <p className=" text-yellow-400">Membuat Dokumen Baru</p>
                  <p>berdasarkan dokumen yang di edit</p>
                </TooltipContent>
              </Tooltip>
            )}
          </DialogTrigger>

          {/* ===== Dialog Content ===== */}
          <DialogContent className="md:min-w-[1000px]">
            <DialogHeader>
              <DialogTitle className="text-center font-bold mb-5 text-2xl">
                {isInput ? "PEMBUATAN DOKUMEN BARU" : "EDIT DOKUMEN"}
              </DialogTitle>
            </DialogHeader>

            {/* ===== Form Fields ===== */}
            <div className="space-y-4">
              {/* Document Name */}
              <div className="space-y-2">
                <div>Nama Dokument</div>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              {/* Short Name + Klinis Type */}
              <div className="flex space-x-3 items-center">
                <p>Nama Singkat Dokument</p>
                <Input
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="w-2/5"
                />

                <p>Jenis Perawat Klinis</p>
                <Select
                  value={perawatKlinis}
                  onValueChange={(value) => setPerawatKlinis(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis Perawat Klinis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perawat Klinis 1">
                      Perawat Klinis 1
                    </SelectItem>
                    <SelectItem value="Perawat Klinis 2">
                      Perawat Klinis 2
                    </SelectItem>
                    <SelectItem value="Perawat Klinis 3">
                      Perawat Klinis 3
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Selection */}
              <div className="space-y-2 flex flex-row">
                {/* Selected Categories */}
                <div className="basis-8/12 space-x-2">
                  <div>Kategori</div>
                  {credentialCategory.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {category.category_name}
                      {category.id_category}
                      <button
                        onClick={() => removeCategory(category.id_category)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Dropdown Category Picker */}
                <div>
                  <Select
                    value={categoryName}
                    onValueChange={(value) => {
                      setCategoryName(value);
                      selectCategory(value);
                    }}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Pilih Kategori Dokumen" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentCategory.map((category, index) =>
                        category?.id_category ? (
                          <SelectItem
                            key={index}
                            value={category.id_category.toString()}
                          >
                            {category.category_name}
                          </SelectItem>
                        ) : null
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ===== Action Buttons ===== */}
            <div className="space-x-5 text-center">
              <Button className="bg-green-500 w-56" onClick={handleSubmit}>
                Submit
              </Button>
              <DialogClose asChild>
                <Button variant="destructive" className="w-56">
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

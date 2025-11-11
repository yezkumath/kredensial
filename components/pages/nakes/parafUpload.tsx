"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { Upload, FileImage } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SetParafStorage } from "@/function/localStorage/paraf";

interface SelectedImage {
  name: string;
  size: number;
  type: string;
  preview: string | ArrayBuffer | null;
}

export function ParafUpload() {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const [base64Data, setBase64Data] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //----------------Function--------------------
  const processImage = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result ?? "";
      setSelectedImage({
        name: file.name,
        size: file.size,
        type: file.type,
        preview: result,
      });
      if (result && typeof result === "string") {
        const base64Only = result.split(",")[1];
        setBase64Data(base64Only);
        SetParafStorage(base64Only);
        setLoading(false);
      }

      setLoading(false);
    };

    reader.onerror = () => {
      alert("Error reading file");
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <div className=" border-green-700 border-4 rounded-lg flex flex-row items-center lg:w-[500px] sm:w-[200px]">
        <Input
          type="text"
          className="text-2xl disabled: text-blue-800 disabled: font-bold border-green-700 border-2 m-1 w-9/12"
          value={selectedImage ? selectedImage.name : "Masukkan Tanda Tangan"}
          disabled
          //onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              onClick={handleButtonClick}
              disabled={loading}
              className=" bg-blue-500 hover:bg-green-700  flex flex-row ml-3 mr-1  "
            >
              {/* <Plus className=" w-5 h-5" strokeWidth={3} />
              UPLOAD */}
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Upload size={24} />
                  UPLOAD
                </>
              )}
            </Button>
          </PopoverTrigger>
          {selectedImage ? (
            <PopoverContent className="w-[600px]">
              <div className=" p-1 bg-gray-50 rounded-lg ">
                <div className="gap-2">
                  {/* Image Preview */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <FileImage size={20} />
                      Paraf Preview
                    </h3>
                    <div className="bg-white p-3 rounded border">
                      <img
                        src={selectedImage.preview?.toString() ?? ""}
                        alt="Preview"
                        className="max-w-full max-h-48 mx-auto rounded"
                      />
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="space-y-3">
                    <h3 className="mt-3 font-semibold text-gray-800">
                      File Information
                    </h3>
                    <div className="bg-white p-3 rounded border space-y-2 text-sm">
                      <div>
                        <strong>Name:</strong> {selectedImage.name}
                      </div>
                      <div>
                        <strong>Type:</strong> {selectedImage.type}
                      </div>
                      <div>
                        <strong>Size:</strong>{" "}
                        {formatFileSize(selectedImage.size)}
                      </div>
                      {/* <div>
                        <strong>Base64 Size:</strong>{" "}
                        {getBase64Size(base64Data)}
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          ) : (
            <PopoverContent className="w-[600px]">
              <div className=" p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Cara Menggunakan ⚠️ ⚠️ ⚠️ :
                </h3>
                <ul className="text-blue-700 text-sm space-y-1 ">
                  <li>
                    • Click "Upload" button untuk memilih gambar Tanda Tangan.
                  </li>
                  <li>• Pastikan background gambar putih atau transparan.</li>
                  <li>• Jenis Gambar yang disupport: JPG, PNG, WebP, SVG.</li>
                  <li>• Pastikan besar file tidak melebih 2 MB.</li>
                  <li>
                    • Pastikan tidak ada ruang kosong di sekitar Tanda Tangan!
                  </li>
                  <li>
                    • Jika terdapat ruang kosong Crop atau potong gambar
                    terlebih dulu.
                  </li>
                </ul>
              </div>
            </PopoverContent>
          )}
        </Popover>
      </div>
    </div>
  );
}

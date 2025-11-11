"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  POST_apply_credential,
  GET_credential_application_check,
} from "@/connection/credentials/application";
import { GET_credential_document } from "@/connection/credentials/document";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { GetLoginCookie } from "@/function/cookie/loginData";
import { GetCookieCredential } from "@/function/cookie/credential";
import { GetAccessCookie } from "@/function/cookie/access";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  FileCheck,
  User,
  Building2,
  Award,
  CheckCircle2,
} from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [beenSubmitted, setBeenSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadding, setIsLoading] = useState(true);
  const [idRuang, setIdRuang] = useState("");
  const [idDoc, setIdDoc] = useState("");
  const [nameDoc, setNameDoc] = useState("");
  const [ruang, setRuang] = useState("");
  const [Nip, setNip] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const loginData = await GetLoginCookie();
    const credential = await GetCookieCredential();
    const accessData = await GetAccessCookie();

    setNip(loginData.nip);
    setName(loginData.nama);
    setIdDoc(credential);
    setRuang(accessData[0].declaration_detail);
    setIdRuang(accessData[0].declaration);

    try {
      const response = await GET_credential_application_check(
        credential,
        loginData.nip,
        accessData[0].declaration
      );
      const Document = await GET_credential_document(Number(credential));

      if (response && response.length > 0) {
        setBeenSubmitted(true);
      } else {
        setBeenSubmitted(false);
      }

      if (Document) {
        setNameDoc(Document[0].name_document);
      }
    } catch (error) {
      console.error("Error checking application:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await POST_apply_credential(Number(idDoc), Nip, idRuang);
      if (response) {
        // redirect to my profil page
        toast.success("Pengajuan berhasil diajukan!");
        setIsDialogOpen(false);
        router.push("/Dashboard");
      } else {
        toast.error("Gagal Melakukan Pengajuan");
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Error submitting application");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {isLoadding ? (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/loading.gif" alt="Loading..." />
            <p>Checking Data Kredensial...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Pengajuan Kewenangan Klinis
                  </h1>
                  <p className="text-sm text-gray-500">
                    Formulir permohonan kenaikan tingkat
                  </p>
                </div>
              </div>

              {/* Warning Alert */}
              {beenSubmitted && (
                <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-5">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-red-800 text-lg mb-1">
                        Peringatan Duplikasi
                      </h3>
                      <p className="text-red-700">
                        Anda sudah mengajukan kewenangan klinis ini sebelumnya.
                        Apakah Anda yakin akan melakukan aplikasi ulang?
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Alert */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 rounded-lg p-5 shadow-sm">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-amber-900 mb-1">
                      Persyaratan Penting
                    </h3>
                    <p className="text-sm text-amber-800">
                      Pastikan seluruh persyaratan dan dokumen pendukung telah
                      terpenuhi sebelum mengajukan permohonan kenaikan tingkat
                      kewenangan klinis.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <FileCheck className="w-5 h-5 mr-2 text-blue-600" />
                Detail Pengajuan
              </h2>

              <div className="space-y-4">
                {/* Applicant Info */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-blue-100 p-2.5 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Pemohon</p>
                    <p className="font-semibold text-gray-800 text-lg">
                      {name}
                    </p>
                    <p className="text-sm text-gray-600">NIP: {Nip}</p>
                  </div>
                </div>

                {/* Credential Info */}
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
                  <div className="bg-blue-100 p-2.5 rounded-lg">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">
                      Kewenangan Klinis
                    </p>
                    <p className="font-semibold text-gray-800">
                      [{idDoc}] {nameDoc || "Memuat..."}
                    </p>
                  </div>
                </div>

                {/* Room Info */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-indigo-100 p-2.5 rounded-lg">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Ruang</p>
                    <p className="font-semibold text-gray-800">{ruang}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className=" text-white font-semibold bg-green-500"
                      size="lg"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Ajukan Permohonan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-gray-800">
                        Konfirmasi Pengajuan
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Pengajuan akan direview oleh{" "}
                          <span className="font-semibold">PJ Pelayanan</span>{" "}
                          dan{" "}
                          <span className="font-semibold">
                            Kepala Instalasi
                          </span>{" "}
                          untuk mengecek kesesuaian data diri dan syarat
                          kewenangan klinis.
                        </p>
                      </div>
                      <p className="text-center font-medium text-gray-800">
                        Apakah Anda yakin ingin mengajukan?
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-lg"
                        onClick={handleSubmit}
                      >
                        Ya, Ajukan
                      </Button>
                      <DialogClose asChild>
                        <Button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-5 rounded-lg">
                          Batal
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  className=" bg-red-400  font-semibold  px-16 py-5"
                  onClick={() => window.history.back()}
                >
                  Kembali
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

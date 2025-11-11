"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { UsersRound, File, ClipboardClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { ApplicationDetail } from "@/connection/interface";
import { GET_InstalationByID } from "@/connection/unit_instalation";
import { GET_paraf_credential_access } from "@/connection/access";
import {
  PUT_supervisor_check,
  PUT_head_of_installation_check,
  PUT_vice_committe_check,
} from "@/connection/credentials/application";
import { GetLoginCookie } from "@/function/cookie/loginData";

export default function ReviewProfile({
  appDetail,
  mutateAppDetail,
  idAccess,
}: {
  appDetail: ApplicationDetail | null | undefined;
  mutateAppDetail: () => Promise<ApplicationDetail | null | undefined>;
  idAccess: number;
}) {
  //  isNakes 5;
  //  isSupervisor  4;
  //  isHead_of_Installation  3;
  //  isMitraBersari 2;
  //  isCommitte 1;

  const router = useRouter();
  const [nip, setNip] = useState("");
  const [note, setNote] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [nameInstalation, SetNameInstalation] = useState("");
  const [isApprove, setIsApprove] = useState(false);
  const [imageSupervisor, setImageSupervisor] = useState("");
  const [imageHeadOfInstalation, SetImageHeadOfInstalation] = useState("");

  useEffect(() => {
    setApprove();
    getNip();
  }, []);

  useEffect(() => {
    getInstalation();
  }, [appDetail]);

  useEffect(() => {
    if (isApprove && appDetail) {
      getAllParaf();
    }
  }, [isApprove, appDetail]);

  useEffect(() => {
    if (note !== "") {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [note]);

  const loadingAnimation = () => {
    return (
      <div className="flex items-center w-5 h-5">
        <img
          src="/images/loading.gif"
          alt="Loading..."
          className=" w-24 h-24 object-cover ml-15"
        />
      </div>
    );
  };

  const getInstalation = async () => {
    try {
      const response = await GET_InstalationByID(appDetail?.nakes_unit || "");
      if (response && response.length > 0) {
        SetNameInstalation(response[0].instalasi);
      }
    } catch (error) {
      console.error("Error fetching access data:", error);
      toast.error("Gagal memuat data akses.");
    }
  };

  const setApprove = () => {
    if (idAccess === 4) {
      if (appDetail?.status_app === 2) setIsApprove(true);
    } else if (idAccess === 3) {
      if (appDetail?.status_app === 3) setIsApprove(true);
    } else if (idAccess == 1) {
      if (appDetail?.status_app === 6) setIsApprove(true);
    }
  };

  const getNip = async () => {
    const loginData = await GetLoginCookie();
    setNip(loginData?.nip);
  };

  const getAllParaf = async () => {
    if (!isApprove) return;

    if (appDetail?.supervisor_nip && appDetail?.supervisor_status === 1) {
      await getParaf(appDetail?.supervisor_nip, "supervisor");
    } else if (appDetail?.supervisor_status === 3) {
      setImageSupervisor("DITOLAK");
    } else {
      setImageSupervisor("Belum Disetujui");
    }

    if (
      appDetail?.head_of_installation_nip &&
      appDetail?.head_of_installation_status === 1
    ) {
      await getParaf(
        appDetail?.head_of_installation_nip,
        "head_of_installation"
      );
    } else if (appDetail?.head_of_installation_status === 3) {
      SetImageHeadOfInstalation("DITOLAK");
    } else {
      SetImageHeadOfInstalation("Belum Disetujui");
    }
  };

  const getParaf = async (
    nip: string,
    role: "supervisor" | "head_of_installation"
  ) => {
    const setImage =
      role === "supervisor" ? setImageSupervisor : SetImageHeadOfInstalation;

    try {
      const response = await GET_paraf_credential_access(nip);

      if (!response?.length || !response[0].paraf) {
        setImage("Not - Available");
        if (!response?.length) {
          console.log("No paraf data found for NIP:", nip);
        } else {
          toast.error(`data Tandatangan untuk NIP: ${nip} kosong`);
        }
        return;
      }

      const base64Data = response[0].paraf
        .replace(/\s/g, "")
        .replace(/[^A-Za-z0-9+/=]/g, "")
        .padEnd(Math.ceil(response[0].paraf.length / 4) * 4, "=");

      const format = detectImageFormat(base64Data);
      setImage(`data:image/${format};base64,${base64Data}`);
    } catch (error) {
      setImage("");
      console.error("Error Getting Image:", error);
      toast.error("Gagal memuat Tanda Tangan");
    }
  };

  const detectImageFormat = (base64: string) => {
    try {
      const header = base64.substring(0, 20);

      if (header.startsWith("iVBORw0KGgo")) return "png";
      if (header.startsWith("/9j/")) return "jpeg";
      if (header.startsWith("UklGR")) return "webp";
      if (header.startsWith("R0lGOD")) return "gif";
      if (header.startsWith("PHN2Zy") || header.startsWith("PD94bW"))
        return "svg+xml";
      if (header.startsWith("/9j/2w") || header.startsWith("/9j/4A"))
        return "jpeg";
      if (header.startsWith("Qk")) return "bmp";

      console.warn("Unknown image format, defaulting to png. Header:", header);
      return "png";
    } catch (error) {
      console.error("Error detecting image format:", error);
      return "png";
    }
  };

  const handleApprove = async () => {
    let response = null;
    try {
      if (idAccess === 1) {
        response = await PUT_vice_committe_check(
          Number(appDetail?.id_application),
          nip,
          1,
          note,
          6
        );
      } else if (idAccess === 3) {
        response = await PUT_head_of_installation_check(
          Number(appDetail?.id_application),
          nip,
          1,
          note,
          3
        );
      } else if (idAccess === 4) {
        response = await PUT_supervisor_check(
          Number(appDetail?.id_application),
          nip,
          1,
          note,
          2
        );
      } else {
        response = null;
      }
      if (response) {
        toast.success("Approve Success");
        await setIsApprove(true);
        if (idAccess === 1) {
          router.push("/Dashboard/Detail_Status/");
        } else {
          await getAllParaf();
        }
      } else {
        toast.error("Gagal Approve");
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Error Approve");
    } finally {
      await mutateAppDetail();
    }
  };

  const handleCancleApprove = async () => {
    let response = null;
    try {
      if (idAccess === 1) {
        response = await PUT_vice_committe_check(
          Number(appDetail?.id_application),
          nip,
          3,
          note,
          8
        );
      } else if (idAccess === 3) {
        response = await PUT_head_of_installation_check(
          Number(appDetail?.id_application),
          nip,
          3,
          note,
          8
        );
      } else if (idAccess === 4) {
        response = await PUT_supervisor_check(
          Number(appDetail?.id_application),
          nip,
          3,
          note,
          8
        );
      } else {
        response = null;
      }
      if (response) {
        toast.success("Approve Cancle Success");
        setIsApprove(true);
        if (idAccess === 1) {
          router.push("/Dashboard/Detail_Status/");
        }
      } else {
        toast.error("Gagal Cancle Approve");
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Error Cancle Approve");
    } finally {
      await mutateAppDetail();
    }
  };

  return (
    <div className="flex flex-col justify-center  items-center">
      <div className="flex flex-col rounded-2xl shadow-2xl p-4 bg-blue-50 w-11/12">
        <p className=" bg-blue-400 text-white font-bold rounded-xl p-2 text-xl text-center">
          REVIEW PENGAJUAN
        </p>
        <div className="mt-4 bg-blue-100 p-4 rounded-xl">
          <div className="flex flex-row items-center space-x-2">
            <div className="text-xl font-bold rounded-lg bg-blue-400 text-white p-1 text-center w-40">
              {appDetail?.short_name}
            </div>
            <div className="text-base">{appDetail?.name_document}</div>
          </div>
          <div className="flex flex-row items-center space-x-2 mt-1">
            <div className="font-semibold rounded-lg bg-neutral-500 text-white p-1 text-center w-40">
              {appDetail?.create_nip}
            </div>
            <div className="text-base">{appDetail?.create_name}</div>
          </div>
          <div className="flex flex-row items-center space-x-2 mt-1">
            <div className="font-semibold rounded-lg bg-neutral-500 text-white p-1 text-center w-40">
              {nameInstalation
                ? nameInstalation.length < 5
                  ? `INSTALASI ${nameInstalation} `
                  : nameInstalation
                : loadingAnimation()}
            </div>
            <div className="text-base">{appDetail?.nakes_unit_name}</div>
          </div>
        </div>
        {/* LIST CHECKLIST */}
        <div className="flex flex-row items-center justify-center pb-8 space-x-7 mt-10">
          <div
            onClick={() =>
              router.push(
                "/Dashboard/Detail_Status/Kredensial_Review/Nakes_Biodata"
              )
            }
            className="flex flex-col items-center justify-center bg-amber-200 px-5 py-2 rounded-xl text-white hover:bg-black w-60 h-64 text-4xl text-center"
          >
            <div className="mb-7">DATA NAKES</div>
            <UsersRound className="h-20 w-20" />
          </div>
          <div
            onClick={() =>
              router.push(
                "/Dashboard/Detail_Status/Kredensial_Review/Nakes_Logbook"
              )
            }
            className="flex flex-col items-center justify-center bg-amber-200 px-5 py-2 rounded-xl text-white hover:bg-black w-60 h-64 text-4xl text-center"
          >
            <div className="mb-7">LOG-BOOK NAKES</div>
            <ClipboardClock className="h-20 w-20" />
          </div>
          <div
            onClick={() =>
              router.push(
                "/Dashboard/Detail_Status/Kredensial_Review/Nakes_Dokumen_Kredensial"
              )
            }
            className="flex flex-col items-center justify-center bg-amber-200 px-5 py-2 rounded-xl text-white hover:bg-black w-60 h-64 text-4xl text-center"
          >
            <div className="mb-7">DOKUMEN KREDENSIAL</div>
            <File className="h-20 w-20" />
          </div>
        </div>
        {isApprove ? (
          <>
            {/* PERSETUJUAN */}
            <div className="bg-white rounded-2xl ">
              <h3 className="text-lg font-medium text-center pt-4">
                Mengetahui
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div>
                    <h4 className="font-medium mb-16">Kepala Instalasi</h4>
                    {appDetail?.head_of_installation_status === 3 ? (
                      <div className="flex justify-center">
                        <div className="text-xl font-bold rounded-lg bg-red-500 text-white p-1 text-center w-40 rotate-z-12">
                          DITOLAK
                        </div>
                      </div>
                    ) : (
                      <>
                        {imageHeadOfInstalation === "" ? (
                          <div className="items-center">
                            {loadingAnimation()}
                          </div>
                        ) : imageHeadOfInstalation === "Not - Available" ||
                          imageHeadOfInstalation === "Belum Disetujui" ? (
                          <div className="flex justify-center">
                            <div>{imageHeadOfInstalation}</div>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <img
                              src={imageHeadOfInstalation}
                              alt="Tanda Tangan"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="border-b border-dotted border-gray-400 pb-1 mb-2 min-h-[1px]"></div>
                  <div className="text-sm">
                    {appDetail?.head_of_installation_name}
                  </div>
                  <div className="text-sm">
                    (
                    {appDetail?.head_of_installation_nip ||
                      "......................................"}
                    )
                  </div>
                </div>

                <div className="text-center">
                  <div>
                    <h4 className="font-medium mb-16">
                      Penangung Jawab Pelayanan
                    </h4>
                    {appDetail?.supervisor_status === 3 ? (
                      <div className="flex justify-center">
                        <div className="text-xl font-bold rounded-lg bg-red-500 text-white p-1 text-center w-40 rotate-z-12 ">
                          DITOLAK
                        </div>
                      </div>
                    ) : (
                      <>
                        {imageSupervisor === "" ? (
                          <div className="items-center">
                            {loadingAnimation()}
                          </div>
                        ) : imageSupervisor === "Not - Available" ||
                          imageSupervisor === "Belum Disetujui" ? (
                          <div className="flex justify-center">
                            <div>{imageSupervisor}</div>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <img src={imageSupervisor} alt="Tanda Tangan" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="border-b border-dotted border-gray-400 pb-1 mb-2 min-h-[1px]"></div>
                  <div className="text-sm">{appDetail?.supervisor_name}</div>
                  <div className="text-sm">
                    (
                    {appDetail?.supervisor_nip ||
                      "......................................"}{" "}
                    )
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-4">
              <h3 className="text-lg font-medium text-center ">
                MEMBERIKAN PERSETUJUAN
              </h3>
              {idAccess === 1 && (
                <div className=" bg-blue-100 p-4 rounded-xl"></div>
              )}
              <div className=" mt-2 bg-blue-100 p-4 rounded-xl">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-amber-500 font-medium">
                      Dimohon Untuk Memperhatikan pernyataan di bawah ini
                      sebelum menyetujui pengajuan Kredensial ini :
                    </span>
                  </div>
                  <div className="bg-amber-50 rounded-xl flex flex-col py-2">
                    <span className="ml-7">✓ Identitas Nakes</span>
                    <span className="ml-12 mb-2">
                      Apakah Data Nakes sudah sesuai dengan ketentuan yang ada?
                    </span>
                    <span className="ml-7">✓ Log-Book Nakes</span>
                    <span className="ml-12 mb-2">
                      Apakah Log-Book Nakes sudah sesuai <br />
                      atau sudah memenuhi jumlah minimum yang di tentukan?
                    </span>
                    <span className="ml-7">✓ Dokumen Kredensial</span>
                    <span className="ml-12 mb-2">
                      Apakah poin pertanyaan yang ada pada Dokumen Kredensial{" "}
                      <br />
                      sesuai dengan yang seharusnya?
                    </span>
                  </div>

                  <span className="mt-5">
                    Apakah Anda yakin menyetujui pengajuan kredensial ini?
                  </span>
                </div>

                <div className="bg-white rounded-xl flex p-2 mb-4 mt-1 flex-row space-x-2">
                  <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className=""
                    placeholder="Tambahkan Catatan Jika perlu [ Jika Tidak ] -->"
                  />
                  {note === "" && (
                    <div className=" flex flex-col items-center">
                      <Button
                        className=" bg-neutral-600"
                        onClick={() => {
                          setIsDisable(false);
                          setNote("Tidak Ada Catatan");
                        }}
                      >
                        Tidak Perlu Menambahkan Catatan
                      </Button>
                      <span className="justify-end text-gray-400  text-xs">
                        Tekan Tombol lanjut memberikan persetujuan
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-row space-x-4 justify-center  items-center">
                  <Button
                    onClick={handleApprove}
                    className="bg-blue-400  shadow-xl"
                    disabled={isDisable}
                  >
                    DISETUJUI
                  </Button>
                  <Button
                    onClick={handleCancleApprove}
                    className="bg-red-400  shadow-xl"
                    disabled={isDisable}
                  >
                    DITOLAK
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

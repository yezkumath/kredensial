"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ManajemenQuestion from "@/components/pages/credentials/Manajement_Question";
import {
  PUT_nakes_done_evaluation,
  PUT_mitrabersari,
} from "@/connection/credentials/application";
import { ApplicationDetail } from "@/connection/interface";
import { GET_DETAIL_credential_application } from "@/connection/credentials/application";
import { GET_total_question_answer } from "@/connection/credentials/answer";
import { GetCookieApplication } from "@/function/cookie/credential";
import { GetCookieAccessAs } from "@/function/cookie/access";
import { GetLoginCookie } from "@/function/cookie/loginData";

export default function Page() {
  const router = useRouter();
  const [application_id, setApplication_id] = useState(-1);
  const [accessAs, setAccessAs] = useState(-1);
  const [isApprove, setIsApprove] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [isDisableFromNote, setIsDisableFromNote] = useState(true);
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null
  );
  const [nipMitrabersati, setNipMitrabersati] = useState("");
  const [note, setNote] = useState("");
  const [totalQuestion, setTotalQuestion] = useState(-1);
  const [totalAnswerNakes, setTotalAnswerNakes] = useState(-1);
  const [totalAnswerMitrabersari, setTotalAnswerMitrabersari] = useState(-1);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (application_id) {
      get_application();
    }
  }, [application_id]);

  useEffect(() => {
    if (application) {
      get_total_question_answer();
    }
  }, [application]);

  useEffect(() => {
    if (note === "") {
      setIsDisableFromNote(true);
    } else {
      setIsDisableFromNote(false);
    }
  }, [note]);

  useEffect(() => {
    setDisableButton();
  }, [totalAnswerMitrabersari, totalAnswerNakes, totalQuestion]);

  const loadData = async () => {
    const id = await GetCookieApplication();
    const access = await GetCookieAccessAs();
    const loginData = await GetLoginCookie();
    setNipMitrabersati(loginData.nip);
    setApplication_id(Number(id));
    setAccessAs(Number(access));
    //  isNakes 5;
    //  isSupervisor  4;
    //  isHead_of_Installation  3;
    //  isMitraBersari 2;
    //  isCommitte 1;
  };

  const get_application = async () => {
    try {
      const response = await GET_DETAIL_credential_application(application_id);
      if (response && response.length > 0) {
        setApplication(response[0]);
        if (accessAs === 5) {
          // 4 true for Nakes
          if (response[0]?.status_app === 4) {
            setIsApprove(true);
          }
        } else if (accessAs === 2) {
          // 5 true for Mitrabersari
          if (response[0]?.status_app === 5) {
            setIsApprove(true);
          }
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    }
  };

  const getPositionType = () => {
    if (isApprove) {
      if (accessAs === 2) {
        console.log("position Mitrabsersari Approve 5");
        return 5;
      } else {
        console.log("position Nakes Approvecode 6 ");
        return 6;
      }
    } else {
      if (accessAs === 2) {
        console.log("position Mitrabsersari 2");
        return 2;
      } else {
        console.log("position Nakes code 3");
        return 3;
      }
    }
  };

  const get_total_question_answer = async () => {
    try {
      const response = await GET_total_question_answer(
        Number(application?.id_document),
        application_id
      );
      if (response && response.length > 0) {
        setTotalQuestion(response[0]?.total_question);
        setTotalAnswerNakes(response[0]?.total_answer_nakes);
        setTotalAnswerMitrabersari(response[0]?.total_answer_mitrabersari);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    }
  };

  const setDisableButton = () => {
    if (accessAs === 5) {
      if (totalQuestion > totalAnswerNakes) {
        setIsDisable(true);
      } else {
        setIsDisable(false);
      }
    } else if (accessAs === 2) {
      if (totalQuestion > totalAnswerMitrabersari) {
        setIsDisable(true);
      } else {
        setIsDisable(false);
      }
    }
  };

  const handleSubmit = async () => {
    let response = null;
    try {
      if (accessAs === 5) {
        response = await PUT_nakes_done_evaluation(
          Number(application?.id_application),
          4
        );
      } else if (accessAs === 2) {
        response = await PUT_mitrabersari(
          Number(application?.id_application),
          nipMitrabersati,
          null,
          null,
          4
        );
      }
      if (response) {
        toast.success("Submit Success");
        // setIsApprove(true);
        window.location.reload();
      } else {
        toast.error("Gagal Submit");
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Error Submit");
    }
  };

  const handleApprove = async () => {
    try {
      const response = await PUT_mitrabersari(
        Number(application?.id_application),
        nipMitrabersati,
        1,
        note,
        5
      );
      if (response) {
        toast.success("Approve Success");
        window.location.reload();
      } else {
        toast.error("Gagal Approve");
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Error Approve");
    }
  };

  const handleCancleApprove = async () => {
    try {
      const response = await PUT_mitrabersari(
        Number(application?.id_application),
        nipMitrabersati,
        1,
        note,
        8
      );
      if (response) {
        toast.success("Approve Cancle Success");
        router.push("/Dashboard/Detail_Status/");
      } else {
        toast.error("Gagal Cancle Approve");
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Error Cancle Approve");
    }
  };

  const handleChildTrigger = () => {
    get_total_question_answer();
  };

  return (
    <div>
      {application && (
        <div>
          {isApprove ? (
            <>
              <div className="flex items-center  justify-center mb-2 border-2 border-amber-500 bg-amber-200 rounded-full">
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
                  Anda Sudah Melkukan Penyimpanan Data Anda tidak dapat merubah
                  Jawaban Anda !!!
                </span>
              </div>
              <ManajemenQuestion
                nip={application.create_nip} // nip who do application
                //key={reloadKey} // for reload manajement question page
                documment={application.id_document} //id document inside application
                credentialApplication={application_id} // id application
                function_menu={getPositionType()} // function for what you want do inside this
                trigerParent={handleChildTrigger} // triger refresh on this page
              />
            </>
          ) : (
            <>
              <ManajemenQuestion
                nip={application.create_nip} // nip who do application
                //key={reloadKey} // for reload manajement question page
                documment={application.id_document} //id document inside application
                credentialApplication={application_id} // id application
                function_menu={getPositionType()} // function for what you want do inside this
                trigerParent={handleChildTrigger} // triger refresh on this page
              />
              <div>
                {accessAs === 5 ? (
                  <div className="flex flex-col justify-center  items-center mt-7 bg-green-300 rounded-xl mx-20">
                    <div className="m-2 text-center">
                      Untuk Menyimpan Jawaban <br /> Anda harus sudah menjawab
                      semua pertanyaan
                    </div>
                    <div className="flex flex-col justify-center  items-center ">
                      <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full px-2 py-2">
                        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                          <span className="text-gray-600 text-sm font-medium">
                            Total:
                          </span>
                          <span className="bg-amber-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                            {totalQuestion}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                          <span className="text-gray-600 text-sm font-medium">
                            Dijawab:
                          </span>
                          <span className="bg-blue-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                            {totalAnswerNakes}
                          </span>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full px-4 py-2 text-sm">
                          {Math.round((totalAnswerNakes / totalQuestion) * 100)}
                          % Selesai
                        </div>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className=" bg-blue-500 mb-2"
                          disabled={isDisable}
                        >
                          Submit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Konfirmasi Submit</DialogTitle>
                        <DialogDescription>
                          Pastikan kembali semua Jawaban. <br />
                          Karna Anda tidak akan bisa merubah jawaban setelah
                          melakukan Submit. <br />
                          <br />
                          Apakah Anda Yakin?
                        </DialogDescription>
                        <DialogClose asChild>
                          <Button
                            className=" bg-blue-500"
                            onClick={handleSubmit}
                          >
                            Submit
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button className=" bg-red-400">Cancel</Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : accessAs === 2 ? (
                  <div className="flex flex-col justify-center  items-center ">
                    <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full px-2 py-2">
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                        <span className="text-gray-600 text-sm font-medium">
                          Total:
                        </span>
                        <span className="bg-amber-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          {totalQuestion}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                        <span className="text-gray-600 text-sm font-medium">
                          Dijawab:
                        </span>
                        <span className="bg-blue-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          {totalAnswerMitrabersari}
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full px-4 py-2 text-sm">
                        {Math.round(
                          (totalAnswerMitrabersari / totalQuestion) * 100
                        )}
                        % Selesai
                      </div>
                    </div>
                    {isDisable ? (
                      <div className="flex flex-col justify-center ">
                        <div className="m-2 text-center">
                          Simpan jawaban Anda <br />
                          Anda baru bisa Menyetujui setelah semua pertanyaan
                          selesai di jawab
                        </div>
                        <Button className=" bg-blue-500" onClick={handleSubmit}>
                          Submit
                        </Button>
                      </div>
                    ) : (
                      <div className="  flex flex-col items-center bg-green-50 rounded-xl border-2 border-green-400 p-2 w-8/12 mx-20 mt-10">
                        <div className="m-2 text-center">
                          Anda Dapat Memberikan Penilaian Akhir <br />
                          silahkan tulis note jika perlu
                        </div>
                        <div className="bg-white rounded-xl flex p-2 mb-4 mt-1 flex-row space-x-2 w-10/12">
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
                                  setIsDisableFromNote(false);
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className=" bg-blue-500 mb-2"
                              disabled={isDisableFromNote}
                            >
                              Approve
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogTitle>Konfirmasi Approve</DialogTitle>
                            <DialogDescription>
                              Pastikan kembali semua Jawaban. <br />
                              Karna Anda tidak akan bisa merubah jawaban setelah
                              melakukan Approve. <br />
                              <br />
                              Apakah Anda Yakin?
                            </DialogDescription>
                            <DialogClose asChild>
                              <Button
                                className=" bg-blue-500"
                                onClick={handleApprove}
                              >
                                Diterima
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                className=" bg-red-500"
                                onClick={handleCancleApprove}
                              >
                                Ditolak
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button className=" bg-orange-400">Cancel</Button>
                            </DialogClose>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

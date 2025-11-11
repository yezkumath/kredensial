"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GET_EMPLOYEE_BY_NIP } from "@/connection/api";
import { DetilDataUser } from "@/connection/interface";
import MyList from "@/components/pages/credentials/applications/notification_card/my_list_application_card";
import { useEffect, useState } from "react";

export default function Page({ nakes_nip }: { nakes_nip: string }) {
  const [detilUser, setDetilUser] = useState<DetilDataUser>();
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(true);

  useEffect(() => {
    if (nakes_nip) {
      fetchData();
    }
  }, [nakes_nip]);

  useEffect(() => {
    const pictureData = () => {
      setProfilePicture(`data:image/jpeg;base64,${detilUser?.foto_profil}`);
    };
    pictureData();
  }, [detilUser]);

  const fetchData = async () => {
    try {
      const detailbyNIP = await GET_EMPLOYEE_BY_NIP(nakes_nip);
      console.log("nomorInduk", nakes_nip);
      if (detailbyNIP) {
        setDetilUser(detailbyNIP);
        setIsLoadingDetail(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options); // "18 January 2000"
  };

  return (
    <div>
      {isLoadingDetail ? (
        <div className="flex flex-col justify-center items-center py-12">
          <p>Loading detail user...</p>
          <div className="flex justify-center items-center mt-3">
            <img src="/images/loading.gif" alt="Loading..." />
          </div>
        </div>
      ) : (
        <div>
          <div className="w-full flex shadow-2xl rounded-2xl  bg-amber-100/20">
            <div className="w-[600px] flex flex-col items-center justify-center">
              <p className="text-3xl font-bold mt-4 uppercase text-blue-500">
                {detilUser?.profesi}
              </p>
              {detilUser?.gender === "P" && (
                <p className="text-lg font-bold text-pink-400">PEREMPUAN</p>
              )}
              {detilUser?.gender === "L" && (
                <p className="text-lg font-bold text-orange-500">LAKI - LAKI</p>
              )}
              <Avatar className="h-48 w-48 rounded-full mt-5">
                <AvatarImage src={profilePicture} alt={detilUser?.nama} />
                <AvatarFallback className="rounded-lg">
                  <img src={"/images/nurse-png.png"} className="ml-6" />
                </AvatarFallback>
              </Avatar>
              <p className="mt-4 text-center">{detilUser?.nama}</p>
              <p className="font-bold text-xl text-center  ">
                {detilUser?.nip}
              </p>

              <table className="border-separate  border-spacing-x-10 mt-20 mb-4">
                <tbody>
                  <tr>
                    <td>MASA BERLAKU STR</td>
                    <td> 7 Juni 1653</td>
                  </tr>
                  <tr>
                    <td>MASA BERLAKU SIPP</td>
                    <td> 7 Juni 1653</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-1 bg-gray-300 m-3"></div>
            <div className="w-full">
              <table className="m-5 border-separate border-spacing-3 border-spacing-x-12">
                <tbody>
                  <tr>
                    <td colSpan={2} className="font-bold">
                      DATA DIRI
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Tempat, Tanggal Lahir</td>
                    <td>
                      {detilUser?.tempat_lahir},{" "}
                      {detilUser?.tgl_lahir && formatDate(detilUser.tgl_lahir)}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Alamat</td>
                    <td>{detilUser?.alamat}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Status</td>
                    <td>{detilUser?.marital_status}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">No Telpone</td>
                    <td>{detilUser?.telp}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Email</td>
                    <td>{detilUser?.mail}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="font-bold">
                      DATA PENDIDIKAN
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Jenis Pendidikan</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Alumnus Institusi</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Tahun Lulus</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="font-bold">
                      DATA PEKERJAAN
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Mulai Bekerja</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="font-semibold">
                      Pengangkatan Tetap (PK1 & PK2)
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-10 text-2xl font-extrabold">Kewenangan KLINIS</p>
          {nakes_nip ? (
            <MyList nip={nakes_nip} />
          ) : (
            <div className="flex justify-center items-center py-12">
              <p>Loading credentials...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

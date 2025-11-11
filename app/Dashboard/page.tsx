"use client";
import { useEffect, useState } from "react";

import { Access } from "@/connection/interface";
import { GetLoginCookie } from "@/function/cookie/loginData";
import {
  GetAccessCookie,
  ResetCookieAccessAs,
  SetCookieAccessAs,
} from "@/function/cookie/access";
import { ResetCookieMedicalPersonal } from "@/function/cookie/medicalPersonnel";
import {
  ResetCookieApplication,
  ResetCookieCredential,
} from "@/function/cookie/credential";
import {
  ResetCookieDocumentLogBook,
  ResetCookieLogBook,
} from "@/function/cookie/logBook";

import MyList from "@/components/pages/credentials/applications/notification_card/my_list_application_card";
import SupervisorList from "@/components/pages/credentials/applications/notification_card/supervisor_list_application_card";
import HeadOfInstallationList from "@/components/pages/credentials/applications/notification_card/head_of_installation_list_application_card";
import MitrabersariList from "@/components/pages/credentials/applications/notification_card/mitrabersari_list_application_card";
import ComitteList from "@/components/pages/credentials/applications/notification_card/committe_list_application_card";

export default function Dashboard() {
  const [nip, setNip] = useState("");
  const [access, setAccess] = useState<Access[]>([]);
  const [supervisor, setSupervisor] = useState<boolean>(false);
  const [head_of_installation, setHead_of_installation] =
    useState<boolean>(false);
  const [mitrabersari, setMitrabersari] = useState<boolean>(false);
  const [committe, setCommitte] = useState<boolean>(false);

  const [room, setRoom] = useState<string>("");
  const [installation, setInstallation] = useState<string>("");
  const [clinicalArea, setClinicalArea] = useState<string>("");

  useEffect(() => {
    getNip();
    getAccess();
    resetUnnecessaryCookies();
  }, []);

  useEffect(() => {
    if (access.length > 0) {
      console.log("Access:", access);
      setUserAccess(access);
    }
  }, [access]);

  const getNip = async () => {
    const loginData = await GetLoginCookie();
    setNip(loginData.nip);
  };

  const getAccess = async () => {
    const accessData = await GetAccessCookie();
    setAccess(accessData);
  };

  const resetUnnecessaryCookies = async () => {
    await SetCookieAccessAs(5); // set default 5
    await ResetCookieMedicalPersonal();
    await ResetCookieApplication();
    await ResetCookieCredential();
    await ResetCookieDocumentLogBook();
    await ResetCookieLogBook();
  };

  const setUserAccess = (data: Access[]) => {
    if (!Array.isArray(data)) {
      console.warn("Access data is not an array");
      return;
    }
    try {
      data.forEach((items) => {
        switch (items.access) {
          case 1:
            setCommitte(true);
            break;
          case 2:
            setMitrabersari(true);
            setClinicalArea(items.declaration_detail);
            break;
          case 3:
            setHead_of_installation(true);
            setInstallation(items.declaration);
            break;
          case 4:
            setSupervisor(true);
            setRoom(items.declaration_detail);
            break;
          default:
            console.log(`Unknown access type: ${items.access}`);
        }
      });
    } catch (error) {
      console.error("Error setting access:", error);
    }
  };

  return (
    <div>
      {supervisor && (
        <div>
          {nip ? (
            <div>
              <h1 className="text-2xl font-bold text-teal-500">
                Daftar Aplikasi Credensial di Ruang {room}
              </h1>
              <SupervisorList nip={nip} />
            </div>
          ) : (
            <div className="flex justify-center items-center py-12">
              <p>Loading Applikasi...</p>
            </div>
          )}
        </div>
      )}

      {head_of_installation && (
        <div>
          {nip ? (
            <div>
              <h1 className="text-2xl font-bold text-emerald-700">
                Daftar Aplikasi Credensial di Instalasi {installation}
              </h1>
              <HeadOfInstallationList nip={nip} />
            </div>
          ) : (
            <div className="flex justify-center items-center py-12">
              <p>Loading Applikasi...</p>
            </div>
          )}
        </div>
      )}

      {mitrabersari && (
        <div>
          {nip ? (
            <div>
              <h1 className="text-2xl font-bold text-orange-500">
                Daftar Aplikasi Credensial di Area Klinis {clinicalArea}
              </h1>
              <MitrabersariList nip={nip} />
            </div>
          ) : (
            <div className="flex justify-center items-center py-12">
              <p>Loading Applikasi...</p>
            </div>
          )}
        </div>
      )}

      {committe && (
        <div>
          <h1 className="text-2xl font-bold text-green-500">
            Daftar Aplikasi Credensial yang Sudah Selesai
          </h1>
          <ComitteList />
        </div>
      )}

      {nip ? (
        <div>
          <h1 className="text-2xl font-bold text-blue-500">
            Daftar Applikasi Credensial Ku
          </h1>
          <MyList nip={nip} />
        </div>
      ) : (
        <div className="flex justify-center items-center py-12">
          <p>Loading Applikasi...</p>
        </div>
      )}
    </div>
  );
}

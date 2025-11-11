"use client";
import { useEffect, useState } from "react";

import ManajemenQuestion from "@/components/pages/credentials/Manajement_Question";
import {
  GetCookieApplication,
  GetCookieCredential,
} from "@/function/cookie/credential";
import { GetCookieAccessAs } from "@/function/cookie/access";
import { GetCookieMedicalPersonal } from "@/function/cookie/medicalPersonnel";

export default function Page() {
  const [accessAs, setAccessAs] = useState(-1);
  const [nakes_nip, setNakes_nip] = useState("");
  const [application_id, setApplication_id] = useState(-1);
  const [credential_id, setCredential_id] = useState(-1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const application = await GetCookieApplication();
    const credential = await GetCookieCredential();
    const nakes_nip = await GetCookieMedicalPersonal();
    const access = await GetCookieAccessAs();
    setApplication_id(Number(application));
    setCredential_id(Number(credential));
    setNakes_nip(nakes_nip);
    setAccessAs(Number(access));
    //  isNakes 5;
    //  isSupervisor  4;
    //  isHead_of_Installation  3;
    //  isMitraBersari 2;
    //  isCommitte 1;
  };

  const getPositionType = () => {
    if (accessAs === 1) {
      //can see mitrabersari and nakes answer
      return 4;
    } else {
      //just can see the question
      return 0;
    }
  };
  const handleChildTrigger = () => {
    //do noting for this page
  };

  return (
    <div>
      {nakes_nip && credential_id && application_id && accessAs && (
        <ManajemenQuestion
          nip={nakes_nip} // nip who do application
          //key={reloadKey} // for reload manajement question page
          documment={credential_id} //id document inside application
          credentialApplication={application_id} // id application
          function_menu={getPositionType()} // function for what you want do inside this
          trigerParent={handleChildTrigger} // triger refresh on this page
        />
      )}
    </div>
  );
}

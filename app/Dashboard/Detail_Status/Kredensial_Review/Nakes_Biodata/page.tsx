"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DetailNurce from "@/components/pages/nakes/detailNakes";
import { GetCookieMedicalPersonal } from "@/function/cookie/medicalPersonnel";

export default function Page() {
  const [nakes_nip, setNakes_nip] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const nip = await GetCookieMedicalPersonal();
    setNakes_nip(nip);
  };

  return <div>{nakes_nip !== "" && <DetailNurce nakes_nip={nakes_nip} />}</div>;
}

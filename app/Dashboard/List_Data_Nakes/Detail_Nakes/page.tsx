"use client";
import { useEffect, useState } from "react";

import { GetCookieMedicalPersonal } from "@/function/cookie/medicalPersonnel";
import DetailNakes from "@/components/pages/nakes/detailNakes";

export default function Page() {
  const [nakes_nip, setNakes_nip] = useState("");

  useEffect(() => {
    setNip();
  }, []);

  const setNip = async () => {
    const nip = await GetCookieMedicalPersonal();
    setNakes_nip(nip);
  };

  return <div>{nakes_nip !== "" && <DetailNakes nakes_nip={nakes_nip} />}</div>;
}

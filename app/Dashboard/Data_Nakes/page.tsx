"use client";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import DetailNurce from "@/components/pages/nakes/detailNakes";
import { SetCookieAccessAs } from "@/function/cookie/access";
import { GetLoginCookie } from "@/function/cookie/loginData";
import { access } from "fs";

export default function Page() {
  const [nip, setNip] = useState("");
  useEffect(() => {
    getCookieData();
  }, []);

  const getCookieData = async () => {
    await SetCookieAccessAs(5);
    const loginData = await GetLoginCookie();
    setNip(loginData.nip);
  };

  if (nip !== "") {
    return <DetailNurce nakes_nip={nip} />;
  }
}

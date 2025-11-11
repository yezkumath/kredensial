"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import { GetCookieCredential } from "@/function/cookie/credential";
import InputQuestion from "@/components/pages/credentials/document/input_new_question";

export default function Page() {
  const [credential_id, setCredential_id] = useState(-1);
  const [nakes_nip, setNakes_nip] = useState("");

  useEffect(() => {
    getDataCookie();
  }, []);

  const getDataCookie = async () => {
    const id = await GetCookieCredential();
    setCredential_id(id);
  };

  if (credential_id !== -1) {
    return <InputQuestion documment={credential_id} />;
  }
}

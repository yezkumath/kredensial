"use client";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { ResetCookieCredential } from "@/function/cookie/credential";

import ListOfCredential from "@/components/pages/credentials/document/list_of_document";
import Dialog_InputEdit_Document from "@/components/pages/credentials/document/input-edit_Document";

export default function Page() {
  useEffect(() => {
    resetCookie();
  }, []);

  const resetCookie = async () => {
    await ResetCookieCredential();
  };
  const [refreshKey, setRefreshKey] = useState(0);
  const handleDocumentCreated = () => {
    // Refresh the list when document is created
    setRefreshKey((prev) => prev + 1);
  };
  return (
    <div>
      <Dialog_InputEdit_Document
        onSuccess={handleDocumentCreated}
        isInput={true}
      />
      <ListOfCredential redirecPage="Input_Document" key={refreshKey} />
    </div>
  );
}

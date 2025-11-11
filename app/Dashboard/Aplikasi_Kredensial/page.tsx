"use client";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import ListOfCredential from "@/components/pages/credentials/document/list_of_document";

export default function Page() {
  return (
    <div>
      <span>Applikasi Kredensial</span>
      <ListOfCredential redirecPage="Pengajuan_Kredensial" />
    </div>
  );
}

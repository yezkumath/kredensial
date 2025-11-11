//set nip for get data Logbook
"use server";
import { cookies } from "next/headers";

export const SetCookieLogBook = async (nip: string) => {
  try {
    (await cookies()).set("LogBook", nip, {
      path: "/",
      httpOnly: false, // change to true if not used in client
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
    });
    return true;
  } catch (error) {
    console.error("Error setting LogBook cookie data:", error);
    return false;
  }
};

export const GetCookieLogBook = async () => {
  try {
    const credentialCookie = (await cookies()).get("LogBook");
    if (credentialCookie?.value) {
      return JSON.parse(credentialCookie.value);
    }
    return null;
  } catch (error) {
    console.error("Error parsing LogBook cookie data:", error);
    return null;
  }
};

export const ResetCookieLogBook = async () => {
  (await cookies()).delete("LogBook");
};

export const SetCookieDocumentLogBook = async (id_document: number) => {
  try {
    (await cookies()).set("Document_LogBook", id_document.toString(), {
      path: "/",
      httpOnly: false, // change to true if not used in client
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
    });
    return true;
  } catch (error) {
    console.error("Error setting LogBook cookie data:", error);
    return false;
  }
};

export const GetCookieDocumentLogBook = async () => {
  try {
    const credentialCookie = (await cookies()).get("Document_LogBook");
    if (credentialCookie?.value) {
      const num = Number(credentialCookie.value);
      return isNaN(num) ? null : num;
    }
    return null;
  } catch (error) {
    console.error("Error parsing LogBook cookie data:", error);
    return null;
  }
};

export const ResetCookieDocumentLogBook = async () => {
  (await cookies()).delete("Document_LogBook");
};

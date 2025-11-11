// Credential has id Credential Document, ID Credential Aplication,
"use server";
import { cookies } from "next/headers";

export const SetCookieCedential = async (id: number) => {
  try {
    const ID = String(id);
    (await cookies()).set("Credential", ID, {
      path: "/",
      httpOnly: false, // change to true if not used in client
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
    });
    return true;
  } catch (error) {
    console.error("Error setting Credential cookie data:", error);
    return false;
  }
};

export const GetCookieCredential = async () => {
  try {
    const credentialCookie = (await cookies()).get("Credential");
    if (credentialCookie?.value) {
      return JSON.parse(credentialCookie.value);
    }
    return null;
  } catch (error) {
    console.error("Error parsing Credential cookie data:", error);
    return null;
  }
};

export const ResetCookieCredential = async () => {
  (await cookies()).delete("Credential");
};

export const SetCookieApplication = async (id: number) => {
  try {
    const ID = String(id);
    (await cookies()).set("Application", ID, {
      path: "/",
      httpOnly: false, // change to true if not used in client
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
    });
    return true;
  } catch (error) {
    console.error("Error setting Application cookie data:", error);
    return false;
  }
};

export const GetCookieApplication = async () => {
  try {
    const aplicationCookie = (await cookies()).get("Application");
    if (aplicationCookie?.value) {
      return JSON.parse(aplicationCookie.value);
    }
    return null;
  } catch (error) {
    console.error("Error parsing LoginData cookie data:", error);
    return null;
  }
};

export const ResetCookieApplication = async () => {
  (await cookies()).delete("Application");
};

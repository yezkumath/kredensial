//import Cookies from "js-cookie";
"use server";
import { cookies } from "next/headers";
import { Access } from "@/connection/interface";

export const SetAccessCookie = async (accessData: Access[]) => {
  try {
    const stringifyData = JSON.stringify(accessData);
    (await cookies()).set("AccessData", stringifyData, {
      path: "/",
      httpOnly: false, // change to true if not used in client
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
    });
    return true;
  } catch (error) {
    console.error("Error setting Access cookie data:", error);
    return false;
  }
};

export const GetAccessCookie = async () => {
  try {
    const cookie = (await cookies()).get("AccessData");
    if (cookie?.value) {
      return JSON.parse(cookie.value);
    }
    return null;
  } catch (error) {
    console.error("Error parsing Access cookie data:", error);
    return null;
  }
};

export const ResetCookieAccess = async () => {
  (await cookies()).delete("AccessData");
};

export const SetCookieAccessAs = async (id: number) => {
  try {
    (await cookies()).set("AccessAs", String(id), {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
    });
    return true;
  } catch (error) {
    console.error("Error setting AccessAs cookie data:", error);
    return false;
  }
};

export const GetCookieAccessAs = async () => {
  try {
    const cookie = (await cookies()).get("AccessAs");
    return cookie?.value ?? null;
  } catch (error) {
    console.error("Error reading AccessAs cookie:", error);
    return null;
  }
};

export const ResetCookieAccessAs = async () => {
  (await cookies()).delete("AccessAs");
};

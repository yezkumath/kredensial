// LOGIN DATA HAS NIP, NAME, AND ROLES
"use server";
import { cookies } from "next/headers";
import { LoginData } from "@/connection/interface";

export const SetLoginCookie = async (userData: LoginData) => {
  try {
    const stringifyData = JSON.stringify(userData);
    (await cookies()).set("LoginData", stringifyData, {
      path: "/",
      httpOnly: false, // change to true if not used in client
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
    });
    return true;
  } catch (error) {
    console.error("Error setting LoginData cookie data:", error);
    return false;
  }
};

export const GetLoginCookie = async () => {
  try {
    const cookie = (await cookies()).get("LoginData");
    if (cookie?.value) {
      return JSON.parse(cookie.value);
    }
    return null;
  } catch (error) {
    console.error("Error parsing LoginData cookie data:", error);
    return null;
  }
};

export async function GetLogOutCookie() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  allCookies.forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });
}

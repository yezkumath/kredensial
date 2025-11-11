// to Save Medical Personal NIP in Cookie use for open spesific data of Medical Personal on list
"use server";
import { cookies } from "next/headers";

export const SetCookieMedicalPersonal = async (nip: string) => {
  try {
    (await cookies()).set("MedicalPersonal", nip, {
      path: "/",
      httpOnly: false, // change to true if not used in client
      sameSite: "lax",
      maxAge: 60 * 60 * 12, // 12 hours
    });
    return true;
  } catch (error) {
    console.error("Error setting MedicalPersonal cookie data:", error);
    return false;
  }
};

export const GetCookieMedicalPersonal = async () => {
  try {
    const credentialCookie = (await cookies()).get("MedicalPersonal");
    if (credentialCookie?.value) {
      return JSON.parse(credentialCookie.value);
    }
    return null;
  } catch (error) {
    console.error("Error parsing MedicalPersonal cookie data:", error);
    return null;
  }
};

export const ResetCookieMedicalPersonal = async () => {
  (await cookies()).delete("MedicalPersonal");
};

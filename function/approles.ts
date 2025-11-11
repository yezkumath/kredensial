"use server";
import {
  GET_approles,
  POST_approles,
  PUT_approles,
  DELETE_approles,
  UPSERT_approles,
} from "@/connection/server";
import { Access } from "@/connection/interface";
import {
  GET_access_bynip,
  GET_credential_access_detail_nip_access_byid,
} from "@/connection/access";

const get_access_min = async (nakes_nip: string) => {
  const access_data: Access[] | null = await GET_access_bynip(nakes_nip);
  if (!access_data || access_data.length === 0) {
    return null;
  }

  const access_min = access_data.reduce((min, current) =>
    current.access < min.access ? current : min
  );
  return access_min;
};

const get_access_detail = async (id: number) => {
  const access_data: Access[] | null =
    await GET_credential_access_detail_nip_access_byid(id);

  if (!access_data || access_data.length === 0) {
    return null;
  }
  console.log("Access Data Retrieved:", access_data);
  const access_min = access_data.reduce((min, current) =>
    current.access < min.access ? current : min
  );
  return access_min;
};

export const POST_function_approles = async (nakes_nip: string) => {
  try {
    const higherAccess: Access | null = await get_access_min(nakes_nip);

    if (!higherAccess) {
      console.log(`No access data found for NIP: ${nakes_nip}`);
      return null;
    }

    const accessLevel = higherAccess.access;
    let app_roles: number;
    let description: string;

    // Using switch for better readability
    switch (accessLevel) {
      case 1:
        app_roles = 0;
        description = "Komite";
        break;
      case 2:
      case 3:
      case 4:
        app_roles = 1;
        description = "Admin";
        break;
      case 5:
        app_roles = 2;
        description = "Nakes";
        break;
      default:
        console.log(
          `Unknown access level: ${accessLevel} for NIP: ${nakes_nip}`
        );
        return null;
    }

    const result = await UPSERT_approles(nakes_nip, app_roles, description);
    console.log(
      `Successfully assigned role ${description} to NIP: ${nakes_nip}`
    );
    return result;
  } catch (error) {
    console.error(
      `Error in POST_function_approles for NIP ${nakes_nip}:`,
      error
    );
    return null;
  }
};

export const PUT_function_approles = async (nip: string) => {
  try {
    const higherAccess: Access | null = await get_access_min(nip);

    if (!higherAccess) {
      console.log(`No access data in EDIT found for NIP: ${nip}`);
      return null;
    }

    const accessLevel = higherAccess.access;
    let app_roles: number;
    let description: string;

    // Using switch for better readability
    switch (accessLevel) {
      case 1:
        app_roles = 0;
        description = "Komite";
        break;
      case 2:
      case 3:
      case 4:
        app_roles = 1;
        description = "Admin";
        break;
      case 5:
        app_roles = 2;
        description = "Nakes";
        break;
      default:
        console.log(`Unknown access level: ${accessLevel} for nip: ${nip}`);
        return null;
    }

    const result = await POST_approles(
      higherAccess.nakes_nip,
      3,
      app_roles,
      description
    );
    console.log(`Successfully edit role ${description} to NIP: ${nip}`);
    return result;
  } catch (error) {
    console.error(`Error in POST_function_approles for NIP ${nip}:`, error);
    return null;
  }
};
export const DELETE_function_approles = async (nip: string) => {
  let higherAccess: Access | null;
  try {
    higherAccess = await get_access_min(nip);

    if (!higherAccess) {
      console.log(`No access data in DELETE found for NIP: ${nip}`);
      return null;
    }

    const result = await DELETE_approles(higherAccess.nakes_nip);
    console.log(`Successfully delete role to NIP: ${higherAccess.nakes_nip}`);
    return result;
  } catch (error) {
    console.error(`Error in POST_function_approles for NIP ${nip}:`, error);
    return null;
  }
};

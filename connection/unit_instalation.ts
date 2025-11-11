"use server";

import {
  getDataQuery, // untuk select
} from "./sqlExecutor";

export async function GET_UnitList() {
  return await getDataQuery(
    `
    SELECT id_ruang,  nama_ruangan
    from master_instalasi_ruang`,
    {},
    `GET_RuangList`
  );
}

export async function GET_InstalationList() {
  return await getDataQuery(
    `
   SELECT DISTINCT instalasi
    from master_instalasi_ruang`,
    {},
    `GET_InstalasiList`
  );
}

export async function GET_InstalationByID(id_ruang: string) {
  return await getDataQuery(
    `
   SELECT instalasi instalasi
    FROM master_instalasi_ruang
    WHERE id_ruang = @id_ruang`,
    { id_ruang },
    `GET_InstalasiList
    id_ruang: ${id_ruang}`
  );
}

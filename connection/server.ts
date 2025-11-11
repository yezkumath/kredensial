"use server";
import { GetLoginCookie } from "@/function/cookie/loginData";
import {
  getDataQuery, // untuk select
  getResultQuery, // untuk Input
  executeTransaction, // untuk Update dan Delete sehingga historynya terekam
} from "./sqlExecutor";

import {
  getDataQuery as getDataQuery_Server, // untuk select
  getResultQuery as getResultQuery_Server, // untuk Input
  executeTransaction as executeTransaction_Server, // untuk Update dan Delete sehingga historynya terekam
} from "./sqlExecutor_server";

import { getDbConnectionServer } from "@/lib/db";

// tb_approles

export async function GET_approles(nakes_nip: string) {
  let sql;
  try {
    sql = await getDbConnectionServer();
    const result =
      await sql.query`SELECT id, nip, app_id, app_roles, description FROM tb_approles WHERE nip = ${nakes_nip}}`;
    return result.recordset;
  } catch (error) {
    console.error("Error:", error);
    return null;
  } finally {
    if (sql) {
      await sql.close();
    }
  }
}

export async function POST_approles(
  nakes_nip: string,
  app_id: number,
  app_roles: number,
  description: string
) {
  let sql;
  try {
    sql = await getDbConnectionServer();
    const result =
      await sql.query`INSERT INTO tb_approles (nip, app_id, app_roles,description) VALUES (${nakes_nip}, ${app_id}, ${app_roles},${description})`;
    return result.recordset;
  } catch (error) {
    console.error("Error:", error);
    return null;
  } finally {
    if (sql) {
      await sql.close();
    }
  }
}

export async function PUT_approles(
  nakes_nip: string,
  app_id: number,
  app_roles: number,
  new_app_roles: number
) {
  let sql;
  try {
    sql = await getDbConnectionServer();
    const result =
      await sql.query`UPDATE tb_approles SET app_roles = ${new_app_roles} WHERE nip = ${nakes_nip} AND app_id = ${app_id} AND app_roles = ${app_roles}`;
    return result.recordset;
  } catch (error) {
    console.error("Error:", error);
    return null;
  } finally {
    if (sql) {
      await sql.close();
    }
  }
}

export async function UPSERT_approles(
  nakes_nip: string,
  app_roles: number,
  description: string | null
) {
  let sql;
  try {
    sql = await getDbConnectionServer();
    const result = await sql.query`
      MERGE INTO tb_approles AS target
      USING 
      (
        VALUES (${nakes_nip}, 3, ${app_roles}, ${description})
      ) AS source (nip, app_id, app_roles, description)
      ON target.nip = source.nip AND target.app_id = source.app_id
      WHEN MATCHED THEN 
      UPDATE SET app_roles = source.app_roles, description = source.description
      WHEN NOT MATCHED THEN
      INSERT (nip, app_id, app_roles, description) 
      VALUES (source.nip, source.app_id, source.app_roles, source.description);`;
    return result.recordset;
  } catch (error) {
    console.error("Error:", error);
    return null;
  } finally {
    if (sql) {
      await sql.close();
    }
  }
}

export async function DELETE_approles(nakes_nip: string) {
  let sql;
  try {
    sql = await getDbConnectionServer();
    const result =
      await sql.query`DELETE tb_approles WHERE nip = ${nakes_nip} AND app_id = 3 `;
    return result.recordset;
  } catch (error) {
    console.error("Error:", error);
    return null;
  } finally {
    if (sql) {
      await sql.close();
    }
  }
}

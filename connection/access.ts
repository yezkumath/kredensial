"use server";
import { GetLoginCookie } from "../function/cookie/loginData";
import {
  getDataQuery, // untuk select
  getResultQuery, // untuk Input
  executeTransaction, // untuk Update dan Delete sehingga historynya terekam
} from "./sqlExecutor";

// VIEW view_credential_access_list
export async function GET_access_list() {
  return await getDataQuery(
    `
    SELECT * FROM view_credential_access_list`,
    {},
    `GET_access_list`
  );
}
export async function GET_access_bynip(nakes_nip: string) {
  return await getDataQuery(
    `
    SELECT nakes_nip, access, access_name, declaration, declaration_detail
    FROM view_credential_access_list
    WHERE nakes_nip = @nakes_nip
`,
    { nakes_nip },
    `GET_access_bynip
    nakes_nip: ${nakes_nip}`
  );
}

// TABLE credential_access
export async function GET_paraf_credential_access(nakes_nip: string) {
  return await getDataQuery(
    `
    SELECT CAST(paraf AS VARCHAR(MAX)) AS paraf
    FROM credential_access 
    WHERE nakes_nip = @nakes_nip
`,
    { nakes_nip },
    `GET_paraf_credential_access
    nakes_nip: ${nakes_nip}`
  );
}
export async function POST_credential_access(nakes_nip: string) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await getResultQuery(
    `
    INSERT INTO credential_access 
    (nakes_nip, create_nip) 
    VALUES 
    (@nakes_nip, @create_nip)`,
    { nakes_nip, create_nip },
    `POST_credential_access
    nakes_nip: ${nakes_nip},
    create_nip: ${create_nip}`
  );
}
export async function PUT_credential_access(nakes_nip: string, paraf: string) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `
                UPDATE credential_access
                SET paraf =  CONVERT(VARBINARY(MAX),@paraf)
                WHERE nakes_nip = @nakes_nip`,
        params: { paraf, nakes_nip },
      },
      {
        query: `
                INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)
                VALUES
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_access",
          id_data: nakes_nip.slice(0, -5),
          action_ontable: "UPDATE",
          action_detail: "Update paraf credential_access",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_credential_access
    paraf: ${paraf}
    nakes_nip: ${nakes_nip}
    create_nip: ${create_nip}`
  );
}

export async function PATCH_DELETE_credential_access(nakes_nip: string) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `
                DELETE credential_access_detail 
                WHERE nakes_nip = @nakes_nip
                DELETE credential_access
                WHERE nakes_nip = @nakes_nip`,
        params: { nakes_nip },
      },
      {
        query: `
                INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)
                VALUES
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_access",
          id_data: nakes_nip.slice(0, -5),
          action_ontable: "DELETE",
          action_detail:
            "PATCH_DELETE credential_access_detail then credential_access",
          create_nip: create_nip,
        },
      },
    ],
    `PATCH_DELETE_credential_access
    nakes_nip: ${nakes_nip}
    create_nip: ${create_nip}`
  );
}

// TABLE credential_access_detail
export async function GET_credential_access_detail_nip_access_byid(id: number) {
  return await getDataQuery(
    `
    SELECT nakes_nip, access 
    FROM credential_access_detail 
    WHERE nakes_nip = (
      SELECT nakes_nip 
      FROM credential_access_detail 
      WHERE id =@id
    )`,
    { id },
    `GET_credential_access_detail_nip_access_byid
    id: ${id}`
  );
}

export async function POST_credential_access_detail(
  nakes_nip: string,
  access: number,
  declaration: string
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await getResultQuery(
    `
    INSERT INTO credential_access_detail 
    (nakes_nip, access, declaration, create_nip)
    VALUES
    (@nakes_nip, @access, @declaration, @create_nip)`,
    { nakes_nip, access, declaration, create_nip },
    `POST_credential_access_detail
    nakes_nip : ${nakes_nip}
    access : ${access}
    declaration : ${declaration}
    create_nip: ${create_nip} `
  );
}
export async function PUT_credential_access_detail(
  id: number,
  access: number,
  declaration: string
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `
        UPDATE credential_access_detail
        SET access = @access, declaration = @declaration
        WHERE  id = @id`,
        params: { access, declaration, id },
      },
      {
        query: `
                INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)
                VALUES
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_access_detail",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE access credential_access_detail",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_credential_access_detail
    id: ${id}
    access: ${access}
    declaration: ${declaration}
    create_nip: ${create_nip}`
  );
}
export async function DELETE_credential_access_detail(id: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `
                DELETE credential_access_detail
                WHERE id = @id`,
        params: { id },
      },
      {
        query: `
                INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)
                VALUES
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_access_detail",
          id_data: id,
          action_ontable: "DELETE",
          action_detail: "DELETE data credential_access_detail",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_credential_access_detail
    id: ${id}
    create_nip: ${create_nip}`
  );
}

// TABLE credential_access_list
export async function GET_credential_access_list() {
  return await getDataQuery(
    `
    SELECT id, role_name, create_date
    FROM credential_access_list`,
    {},
    `GET_credential_access_list`
  );
}

export async function GET_credential_access_byid(id: number) {
  return await getDataQuery(
    `
    SELECT id, role_name
    FROM credential_access_list
    WHERE id = @id`,
    { id },
    `GET_credential_access_byid
    id: ${id}`
  );
}

export async function POST_credential_access_list(role_name: string) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await getResultQuery(
    `
    INSERT INTO credential_access_list 
    (role_name, create_nip)
    VALUES
    (@role_name, @create_nip)`,
    { role_name, create_nip },
    `POST_credential_access_list
    role_name: ${role_name}
    create_nip: ${create_nip}`
  );
}
export async function PUT_credential_access_list(
  role_name: string,
  id: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `
        UPDATE credential_access_list
        SET role_name = @role_name
        WHERE id = @id`,
        params: { role_name, id },
      },
      {
        query: `
                INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)
                VALUES
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_access_list",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE role name credential_access_list",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_credential_access_list
    role_name: ${role_name}
    id: ${id}
    create_nip: ${create_nip}`
  );
}
export async function DELETE_credential_access_list(id: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `
                DELETE credential_access_list
                WHERE id = @id`,
        params: { id },
      },
      {
        query: `
                INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)
                VALUES
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_access_list",
          id_data: id,
          action_ontable: "DELETE",
          action_detail: "DELETE data credential_access_list",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_credential_access_list
    id: ${id}
    create_nip: ${create_nip}`
  );
}

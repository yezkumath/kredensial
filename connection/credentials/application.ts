"use server";
import { GetLoginCookie } from "@/function/cookie/loginData";
import {
  getDataQuery, // untuk select
  getResultQuery, // untuk Input
  executeTransaction, // untuk Update dan Delete sehingga historynya terekam
} from "../sqlExecutor";

import { ApplicationCard } from "@/connection/interface";

//VIEW view_credential_application_card-------------------------------------------------------------
export async function GET_my_list_application_card(
  nip: string
): Promise<ApplicationCard[] | null> {
  return await getDataQuery(
    `
    SELECT * FROM view_credential_application_card
    WHERE create_nip = @nip
  `,
    { nip },
    `GET_my_list_application_card
      nip: ${nip}`
  );
}

export async function GET_supervisor_list_application_card(
  nip: string
): Promise<ApplicationCard[] | null> {
  return await getDataQuery(
    `
    SELECT * FROM view_credential_application_card vca
    WHERE status_app = 1
    AND EXISTS (
      SELECT 1 
      FROM credential_access_detail cad
      WHERE cad.access = 4 
      AND cad.nakes_nip = @nip
      AND vca.nakes_unit LIKE '%' + cad.declaration + '%'
  ) `,
    //   ` --> Hass error if sub query return more than 1 value
    //  SELECT * FROM view_credential_application_card
    //  WHERE
    //  nakes_unit LIKE '%' +
    //     (
    //       SELECT declaration
    //       FROM credential_access_detail
    //       WHERE access = 4 AND nakes_nip = @nip
    //     ) + '%'
    //   AND status_app = 1`,
    { nip },
    `GET_supervisor_list_application_card
      nip: ${nip}`
  );
}

export async function GET_head_of_installation_list_application_card(
  nip: string
): Promise<ApplicationCard[] | null> {
  return await getDataQuery(
    `
    SELECT * FROM view_credential_application_card
    WHERE 
        (
            SELECT TOP 1 instalasi 
            FROM master_instalasi_ruang 
            WHERE id_ruang LIKE '%'+ nakes_unit + '%'
        ) 
        = 
        (
            SELECT declaration 
            FROM credential_access_detail
            WHERE access = 3 AND nakes_nip = 1644010896
        ) 
        AND  status_app = 2`,
    { nip },
    `GET_head_of_installation_list_application_card
      nip: ${nip}`
  );
}

export async function GET_mitrabersari_list_application_card(
  nip: string
): Promise<ApplicationCard[] | null> {
  return await getDataQuery(
    `
  SELECT * FROM view_credential_application_card
  WHERE
    (
          SELECT declaration 
          FROM credential_access_detail
          WHERE access = 2 AND nakes_nip = @nip
    ) IN 
    (
      SELECT c.id_category FROM credential_category c 
      WHERE c.id_document = id_document
    )
    AND status_app = 4`,
    { nip },
    `GET_mitrabersari_list_application_card
      nip: ${nip}`
  );
}

export async function GET_committe_list_application_card(): Promise<
  ApplicationCard[] | null
> {
  return await getDataQuery(
    `
    SELECT * FROM view_credential_application_card
    WHERE  status_app = 5 OR status_app = 6`,
    {},
    `GET_committe_list_application_card`
  );
}

//VIEW view_credential_application_detail---------------------------------------------------------------------------------------------------------
export async function GET_DETAIL_credential_application(
  id_application: number
) {
  return getDataQuery(
    `
    SELECT * FROM view_credential_application_detail
    WHERE id_application = @id_application`,
    { id_application },
    `GET_DETAIL_credential_application
    id_application: ${id_application}`
  );
}

//TABLE credential_application----------------------------------------------------------------------------------------------------------------------
export async function GET_credential_application_check(
  id_document: string,
  create_nip: string,
  nakes_unit: string
) {
  return await getDataQuery(
    `
    SELECT * FROM credential_application
    WHERE id_document = @id_document
    AND create_nip = @create_nip 
    AND nakes_unit = @nakes_unit`,
    { id_document, create_nip, nakes_unit },
    `GET_credential_application_check
    id_document: ${id_document}
    create_nip: ${create_nip}
    nakes_unit: ${nakes_unit}`
  );
}

export async function POST_apply_credential(
  id_document: number,
  create_nip: string,
  nakes_unit: string
) {
  return getResultQuery(
    `
    INSERT INTO credential_application 
    (id_document, create_nip, nakes_unit, status_app)
    VALUES
    (@id_document, @create_nip, @nakes_unit,1)`,
    { id_document, create_nip, nakes_unit },
    `POST_apply_credential
    id_document: ${id_document}
    create_nip: ${create_nip}
    nakes_unit: ${nakes_unit}`
  );
}

export async function PUT_supervisor_check(
  id: number,
  supervisor_nip: string,
  supervisor_status: number,
  supervisor_note: string,
  status_app: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_application  
              SET supervisor_nip = @supervisor_nip, supervisor_status = @supervisor_status,
              supervisor_note = @supervisor_note, status_app = @status_app
              WHERE id = @id`,
        params: {
          supervisor_nip,
          supervisor_status,
          supervisor_note,
          status_app,
          id,
        },
      },
      {
        query: `INSERT INTO credential_log_activity
        (table_name, id_data, action_ontable, action_detail, create_nip)
        VALUES
        (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_application",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE supervisor status",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_supervisor_check
    id:${id} 
    supervisor_nip:${supervisor_nip} 
    supervisor_status:${supervisor_status}
    create_nip:${create_nip}
    status_app:${status_app}
    `
  );
}

export async function PUT_head_of_installation_check(
  id: number,
  head_of_installation_nip: string,
  head_of_installation_status: number,
  head_of_installation_note: string,
  status_app: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_application  
              SET head_of_installation_nip = @head_of_installation_nip, 
              head_of_installation_status = @head_of_installation_status, 
              head_of_installation_note = @head_of_installation_note,
              status_app = @status_app
              WHERE id = @id`,
        params: {
          head_of_installation_nip,
          head_of_installation_status,
          head_of_installation_note,
          status_app,
          id,
        },
      },
      {
        query: `INSERT INTO credential_log_activity
        (table_name, id_data, action_ontable, action_detail, create_nip)
        VALUES
        (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_application",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE head_of_installation status",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_head_of_installation_check
    id :${id}
    head_of_installation_nip :${head_of_installation_nip}
    head_of_installation_status :${head_of_installation_status}
    head_of_installation_note :${head_of_installation_note}
    create_nip :${create_nip}
    status_app, = ${status_app}`
  );
}

export async function PUT_nakes_done_evaluation(
  id: number,
  status_app: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_application  
              SET status_app = @status_app
              WHERE id = @id`,
        params: {
          status_app,
          id,
        },
      },
      {
        query: `INSERT INTO credential_log_activity
        (table_name, id_data, action_ontable, action_detail, create_nip)
        VALUES
        (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_application",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE status_app after done Evaluation by Nakes",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_supervisor_check
    id:${id} 
    create_nip:${create_nip}
    status_app:${status_app}`
  );
}

export async function PUT_mitrabersari(
  id: number,
  new_nip: string,
  status: number | null,
  note: string | null,
  status_app: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_application
              SET 
                  mitrabersari1_nip = 
                      CASE 
                          WHEN mitrabersari1_nip IS NULL OR mitrabersari1_nip = '' 
              THEN @new_nip 
                          ELSE mitrabersari1_nip 
                      END,
                  mitrabersari2_nip = 
                      CASE 
                          WHEN (mitrabersari1_nip IS NOT NULL AND mitrabersari1_nip <> '') 
                              AND (mitrabersari2_nip IS NULL OR mitrabersari2_nip = '') 
                          THEN @new_nip 
                          ELSE mitrabersari2_nip 
                      END,
                  mitrabersari3_nip = 
                      CASE 
                          WHEN (mitrabersari1_nip IS NOT NULL AND mitrabersari1_nip <> '') 
                              AND (mitrabersari2_nip IS NOT NULL AND mitrabersari2_nip <> '') 
                              AND (mitrabersari3_nip IS NULL OR mitrabersari3_nip = '') 
                          THEN @new_nip 
                          ELSE mitrabersari3_nip 
                      END,
                  mitrabersari_status = @status,
                  mitrabersari_note = @note,
                  status_app = @status_app
              WHERE id = @id;`,
        params: {
          new_nip,
          status,
          note,
          status_app,
          id,
        },
      },
      {
        query: `INSERT INTO credential_log_activity
        (table_name, id_data, action_ontable, action_detail, create_nip)
        VALUES
        (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_application",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE mitrabersari status",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_mitrabersari
    id :${id}
    new_nip :${new_nip}
    status :${status}
    note :${note}
    create_nip :${create_nip}
    status_app: ${status_app}`
  );
}

export async function PUT_vice_committe_check(
  id: number,
  vice_committe_nip: string,
  vice_committe_status: number,
  vice_committe_note: string,
  status_app: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_application  
                SET vice_committe_nip = @vice_committe_nip, vice_committe_status = @vice_committe_status, 
                vice_committe_note = @vice_committe_note, status_app = @status_app
                WHERE id = @id`,
        params: {
          vice_committe_nip,
          vice_committe_status,
          vice_committe_note,
          status_app,
          id,
        },
      },
      {
        query: `INSERT INTO credential_log_activity
        (table_name, id_data, action_ontable, action_detail, create_nip)
        VALUES
        (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_application",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE vice_committe status",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_vice_committe_check
    id:${id} 
    vice_committe_nip:${vice_committe_nip} 
    vice_committe_status:${vice_committe_status}
    create_nip:${create_nip}
    status_app:${status_app}`
  );
}

export async function PUT_committe_check(id: number, committe_nip: string) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_application  
                SET committe_nip = @committe_nip
                WHERE id = @id`,
        params: { committe_nip, id },
      },
      {
        query: `INSERT INTO credential_log_activity
        (table_name, id_data, action_ontable, action_detail, create_nip)
        VALUES
        (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_application",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE vice_committe status",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_vice_committe_check
    id:${id} 
    committe_nip:${committe_nip} 
    create_nip:${create_nip}`
  );
}

export async function DELETE_application(id: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `DELETE credential_application  
                WHERE id = @id`,
        params: { id },
      },
      {
        query: `INSERT INTO credential_log_activity
        (table_name, id_data, action_ontable, action_detail, create_nip)
        VALUES
        (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_application",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE vice_committe status",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_application`
  );
}

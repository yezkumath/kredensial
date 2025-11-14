"use server";
import { GetLoginCookie } from "@/function/cookie/loginData";
import {
  getDataQuery, // untuk select
  getResultQuery, // untuk Input
  executeTransaction, // untuk Update dan Delete sehingga historynya terekam
} from "./sqlExecutor";

//VIEW view_credential_logbook
export async function GET_logbook_detail(
  id_document: number,
  create_nip: string
) {
  return await getDataQuery(
    `
SELECT dl.id,  dl.id_document, dl.id_category_logbook, cl.declaration AS category_logbook_name, dl.count_min, 
        l.id as id_logbook,   l.note AS logbook_note, 
    l.drug AS logbook_drug, 
    l.sop AS logbook_sop, l.supervisor_nip,  e.nama AS supervisor_name, l.create_nip, l.create_date,  (
        SELECT TOP 1 declaration 
        FROM credential_access_detail 
        WHERE l.create_nip = nakes_nip 
            AND access = 5
    ) AS nakes_unit
FROM credential_document_logbook dl
LEFT  JOIN credential_category_logbook cl
ON dl.id_category_logbook = cl.id
LEFT JOIN credential_logbook l
ON cl.id = l.id_document_category
AND l.create_nip = @create_nip
LEFT JOIN tb_employees e
    ON l.supervisor_nip = e.nip
WHERE dl.id_document = @id_document
   `,
    { create_nip: String(create_nip), id_document },
    `GET_logbook_detail
     create_nip: ${create_nip}
        id_document: ${id_document}`
  );
}

export async function GET_logbook_each_document(create_nip: string) {
  return await getDataQuery(
    `
     SELECT DISTINCT  a.id_document, d.short_name, d.pk_grade, d.name_document,
    MAX(a.create_date) AS create_date
    FROM credential_application  a
    LEFT JOIN  credential_document d
    ON a.id_document = d.id
    WHERE a.create_nip = @create_nip
    GROUP BY a.id_document, d.short_name, d.pk_grade, d.name_document`,
    { create_nip },
    `GET_logbook_eatch_document
    create_nip: ${create_nip}`
  );
}

//TABLE credential_category_logbook
export async function GET_category_logbook() {
  return await getDataQuery(
    `
    SELECT * FROM credential_category_logbook  ORDER BY id DESC`,
    {},
    `GET_category_logbook`
  );
}

export async function POST_category_logbook(declaration: string) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await getResultQuery(
    `
    INSERT INTO credential_category_logbook
    (declaration, create_nip)
    VALUES
    (@declaration, @create_nip)`,
    { declaration, create_nip },
    `POST_category_logbook
    declaration: ${declaration},
    create_nip: ${create_nip}`
  );
}

export async function PUT_category_logbook(id: number, declaration: string) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_category_logbook
                SET declaration = @declaration
                WHERE id = @id`,
        params: { declaration, id },
      },
      {
        query: `INSERT INTO credential_log_activity
        (table_name, id_data, action_ontable, action_detail, create_nip)
        VALUES
        (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_category_logbook",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE declaration",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_category_logbook
    id: ${id}
    declaration: ${declaration}
    create_nip: ${create_nip}`
  );
}

export async function DELETE_category_logbook(id: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `DELETE FROM credential_category_logbook
                WHERE id = @id`,
        params: { id },
      },
      {
        query: `INSERT INTO credential_log_activity
        (table_name, id_data, action_ontable, action_detail, create_nip)
        VALUES
        (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_category_logbook",
          id_data: id,
          action_ontable: "DELETE",
          action_detail: "DELETE data",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_category_logbook
    id: ${id}
    create_nip: ${create_nip}`
  );
}

//TABLE credential_document_logbook
export async function GET_category_and_document_logbook() {
  return await getDataQuery(
    `
    SELECT dl.id, d.id as id_document,d.short_name, d.name_document, d.status,
      dl.id_category_logbook, cl.declaration,
      dl.count_min, dl.create_date
    FROM credential_document d
    LEFT JOIN credential_document_logbook dl
    ON  d.id = dl.id_document
    LEFT JOIN credential_category_logbook cl
    ON dl.id_category_logbook = cl.id`,
    {},
    `GET_category_document_logbook`
  );
}

export async function POST_category_and_document_logbook(
  id_document: number,
  id_category_logbook: number,
  count_min: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await getResultQuery(
    `
    INSERT INTO credential_document_logbook
    (id_document, id_category_logbook, count_min, create_nip)
    VALUES
    (@id_document, @id_category_logbook, @count_min, @create_nip)`,
    { id_document, id_category_logbook, count_min, create_nip },
    `POST_category_and_document_logbook
    id_document: ${id_document},
    id_category_logbook: ${id_category_logbook},
    count_min: ${count_min},
    create_nip: ${create_nip}`
  );
}

export async function PUT_category_and_document_logbook(
  id: number,
  id_category_logbook: number,
  count_min: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_document_logbook
                SET  id_category_logbook = @id_category_logbook,
                count_min = @count_min
                WHERE id = @id`,
        params: { id_category_logbook, count_min, id },
      },
      {
        query: `INSERT INTO credential_log_activity
        (table_name, id_data, action_ontable, action_detail, create_nip)    
        VALUES
        (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_document_logbook",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE data credential_document_logbook",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_category_and_document_logbook
    id: ${id},
    id_category_logbook: ${id_category_logbook},
    count_min: ${count_min},
    create_nip: ${create_nip}`
  );
}

export async function DELETE_category_and_document_logbook(id: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `DELETE FROM credential_document_logbook
                WHERE id = @id`,
        params: { id },
      },
      {
        query: `INSERT INTO credential_log_activity
        (table_name, id_data, action_ontable, action_detail, create_nip)    
        VALUES
        (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_document_logbook",
          id_data: id,
          action_ontable: "DELETE",
          action_detail: "DELETE data credential_document_logbook",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_category_and_document_logbook
    id: ${id}
    create_nip: ${create_nip}`
  );
}

//TABLE credential_logbook
export async function POST_logbook(
  id_document_category: number,
  note: string,
  drug: string | null
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await getResultQuery(
    `
    INSERT INTO credential_logbook
    (id_document_category, note, drug, create_nip)
    VALUES
    (@id_document_category, @note, @drug, @create_nip)`,
    { id_document_category, note, drug, create_nip },
    `POST_logbook
    id_document_category: ${id_document_category},
    note: ${note},
    drug: ${drug}
    create_nip: ${create_nip}`
  );
}

export async function PUT_logbook(
  id: number,
  note: string,
  drug: string | null
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_logbook

                SET note = @note, drug = @drug
                WHERE id= @id`,
        params: { note, drug, id },
      },
      {
        query: `INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)    
                VALUES
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_logbook",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE note and drug",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_logbook
    id: ${id},
    note: ${note},
    drug: ${drug},
    create_nip: ${create_nip}`
  );
}

export async function PUT_Approve_logbook(id: number, sop: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_logbook
                SET sop = @sop, supervisor_nip = @create_nip
                WHERE id= @id`,
        params: { sop, create_nip, id },
      },
      {
        query: `INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)    
                VALUES
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_logbook",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: `UPDATE Sop and supervisor_nip ${create_nip}`,
          create_nip: create_nip,
        },
      },
    ],
    `PUT_logbook
    id: ${id},
    sop: ${sop},
    supervisor_nip: ${create_nip}3`
  );
}

export async function DELETE_logbook(id: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `DELETE FROM credential_logbook
                WHERE id= @id`,
        params: { id },
      },
      {
        query: `INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)    
                VALUES
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_logbook",
          id_data: id,
          action_ontable: "DELETE",
          action_detail: "DELETE data credential_logbook",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_logbook
    id: ${id}
    create_nip: ${create_nip}`
  );
}

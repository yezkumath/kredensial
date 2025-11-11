"use server";
import { GetLoginCookie } from "@/function/cookie/loginData";
import {
  getDataQuery, // untuk select
  getResultQuery, // untuk Input
  executeTransaction, // untuk Update dan Delete sehingga historynya terekam
} from "../sqlExecutor";

//TABLE credential_answer

export async function GET_total_question_answer(
  id_document: number,
  id_application: number
) {
  return await getDataQuery(
    `
    SELECT
    (
      SELECT COUNT(*) 
      FROM view_credential_question_list 
      WHERE id_document = @id_document
    ) AS total_question , 
    (
      SELECT COUNT(*) 
      FROM credential_answer 
      WHERE 
        id_application = @id_application and 
        target_nip = create_nip
    ) AS total_answer_nakes, 
    (
      SELECT COUNT(*) 
      FROM credential_answer 
      WHERE 
        id_application = @id_application and 
        target_nip <> create_nip
    ) AS total_answer_mitrabersari`,
    { id_document, id_application },
    `GET_total_question_answer
    id_document: ${id_document}
    id_application: ${id_application}`
  );
}

export async function GET_credential_answer(id_application: number) {
  return await getDataQuery(
    `
    SELECT * FROM credential_answer
    WHERE id_application = @id_application`,
    { id_application },
    `GET_credential_answer
    id_application: ${id_application}`
  );
}

// export async function POST_credential_answer(
//   id_application: number,
//   target_nip: string,
//   question_type: string,
//   id_question: number,
//   answer: number
// ) {
//   const loginData = await GetLoginCookie();
//   const create_nip = loginData?.nip;
//   return await getResultQuery(
//     `
//         INSERT INTO credential_answer
//         (id_application,target_nip,question_type,id_question,answer,create_nip)
//         VALUES
//         (@id_application, @target_nip, @question_type, @id_question, @answer, @create_nip)`,
//     {
//       id_application,
//       target_nip,
//       question_type,
//       id_question,
//       answer,
//       create_nip,
//     },
//     `POST_credential_answer
//     id_application: ${id_application},
//     target_nip: ${target_nip},
//     question_type: ${question_type},
//     id_question: ${id_question},
//     answer: ${answer},
//     create_nip: ${create_nip}`
//   );
// }

export async function POST_credential_answer(
  id_application: number,
  target_nip: string,
  question_type: string,
  id_question: number,
  answer: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;

  return await executeTransaction(
    [
      {
        query: `
           IF EXISTS (
            SELECT 1 FROM credential_answer
            WHERE id_application = @id_application
             AND  create_nip = @create_nip
              AND target_nip = @target_nip
              AND question_type = @question_type
              AND id_question = @id_question
          )
          BEGIN
            -- UPDATE existing answer
            UPDATE credential_answer
            SET answer = @answer,
                create_date = GETDATE(),
                create_nip = @create_nip
            WHERE id_application = @id_application
              AND  create_nip = @create_nip
              AND target_nip = @target_nip
              AND question_type = @question_type
              AND id_question = @id_question
              AND create_nip <> @target_nip
          END
          ELSE
          BEGIN
            -- INSERT new answer
            INSERT INTO credential_answer
            (id_application, target_nip, question_type, id_question, answer, create_nip)
            VALUES
            (@id_application, @target_nip, @question_type, @id_question, @answer, @create_nip)
          END
        `,
        params: {
          id_application,
          target_nip,
          question_type,
          id_question,
          answer,
          create_nip,
        },
      },
      {
        query: `
          INSERT INTO credential_log_activity
          (table_name, id_data, action_ontable, action_detail, create_nip)
          VALUES 
          (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_answer",
          id_data: id_application.toString(),
          action_ontable: "UPSERT",
          action_detail: `UPSERT answer for ${question_type} ${id_question}`,
          create_nip: create_nip,
        },
      },
    ],
    `POST_credential_answer
    id_application: ${id_application},
    target_nip: ${target_nip},
    question_type: ${question_type},
    id_question: ${id_question},
    answer: ${answer},
    create_nip: ${create_nip}`
  );
}

// Alternative: Using MERGE statement (SQL Server 2008+)
export async function POST_credential_answer_MERGE(
  id_application: number,
  target_nip: string,
  question_type: string,
  id_question: number,
  answer: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;

  return await executeTransaction(
    [
      {
        query: `
          MERGE credential_answer AS target
          USING (
            SELECT 
              @id_application AS id_application,
              @create_nip AS create_nip,
              @target_nip AS target_nip,
              @question_type AS question_type,
              @id_question AS id_question
          ) AS source
          ON target.id_application = source.id_application
            AND target.create_nip = source.create_nip
            AND target.target_nip = source.target_nip
            AND target.question_type = source.question_type
            AND target.id_question = source.id_question
          WHEN MATCHED THEN
            UPDATE SET 
              answer = @answer,
              update_date = GETDATE()
             -- update_nip = @create_nip
          WHEN NOT MATCHED THEN
            INSERT (id_application, target_nip, question_type, id_question, answer, create_nip, create_date)
            VALUES (@id_application, @target_nip, @question_type, @id_question, @answer, @create_nip, GETDATE());`,
        params: {
          id_application,
          target_nip,
          question_type,
          id_question,
          answer,
          create_nip,
        },
      },
      {
        query: `
          INSERT INTO credential_log_activity
          (table_name, id_data, action_ontable, action_detail, create_nip)
          VALUES 
          (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_answer",
          id_data: id_application.toString(),
          action_ontable: "UPSERT",
          action_detail: `UPSERT answer for ${question_type} ${id_question}`,
          create_nip: create_nip,
        },
      },
    ],
    `POST_credential_answer_MERGE
    id_application: ${id_application},
    target_nip: ${target_nip},
    question_type: ${question_type},
    id_question: ${id_question},
    answer: ${answer},
    create_nip: ${create_nip}`
  );
}

export async function PUT_credential_answer(id: number, answer: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPTADE credential_answer 
                SET answer = @answer
                WHERE id = @id`,
        params: { answer, id },
      },
      {
        query: `INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)
                VALUES 
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_answer",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE answer value",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_credential_answer
    id: ${id}
    answer: ${answer}`
  );
}

export async function DELETE_credential_answers_by_application(
  id_application: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;

  return await executeTransaction(
    [
      {
        query: `DELETE FROM credential_answer WHERE id_application = @id_application`,
        params: { id_application },
      },
      {
        query: `INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)
                VALUES 
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_answer",
          id_data: id_application.toString(),
          action_ontable: "DELETE",
          action_detail: "DELETE all answers for application",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_credential_answers_by_application
    id_application: ${id_application}
    create_nip: ${create_nip}`
  );
}
